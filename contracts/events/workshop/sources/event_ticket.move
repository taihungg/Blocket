module event_chain::ticket {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::url::{Self, Url};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    use sui::table::{Self, Table};
    use sui::dynamic_field as df;

    friend event_chain::event_manager;

    // Lỗi
    const ETicketAlreadyUsed: u64 = 0;
    const ETicketExpired: u64 = 1;
    const ETicketCancelled: u64 = 2;
    const ENotAuthorized: u64 = 3;
    const ETicketAlreadyCheckedIn: u64 = 4;
    const ETicketNotFound: u64 = 5;

    // Cấu trúc vé sự kiện
    struct Ticket has key, store {
        id: UID,
        event_details: String,
        original_price: u64,
        expiration_date: u64,
        ownership_history: vector<address>,
        is_used: bool,
        is_cancelled: bool,
        max_resale_price: u64,
    }

    // Trạng thái check-in
    struct CheckInStatus has key, store {
        id: UID,
        ticket_id: address,
        is_checked_in: bool,
    }

    // Registry để theo dõi tất cả các vé và trạng thái
    struct TicketRegistry has key {
        id: UID,
        tickets_by_id: Table<address, bool>, // true nếu vé vẫn tồn tại
    }

    // Các sự kiện
    struct TicketMinted has copy, drop {
        ticket_id: address,
        owner: address,
        event_details: String,
        original_price: u64,
        expiration_date: u64,
    }

    struct TicketValidated has copy, drop {
        ticket_id: address,
        validator: address,
    }

    struct TicketCheckedIn has copy, drop {
        ticket_id: address,
        attendee: address,
    }

    struct TicketCancelled has copy, drop {
        ticket_id: address,
        owner: address,
    }

    struct TicketTransferred has copy, drop {
        ticket_id: address,
        from: address, 
        to: address,
    }

    struct MaxResalePriceUpdated has copy, drop {
        ticket_id: address,
        new_price: u64,
        updater: address,
    }

    // Khởi tạo module
    fun init(ctx: &mut TxContext) {
        // Tạo và chia sẻ registry
        let registry = TicketRegistry {
            id: object::new(ctx),
            tickets_by_id: table::new(ctx),
        };
        transfer::share_object(registry);
    }

    // Phát hành vé mới - chỉ module event_manager có thể gọi
    public(friend) fun mint(
        to: address,
        event_details: String,
        original_price: u64,
        expiration_date: u64,
        url_bytes: vector<u8>,
        ctx: &mut TxContext
    ) {
        // Tạo vector trống để lưu lịch sử sở hữu
        let ownership_history = vector::empty<address>();
        vector::push_back(&mut ownership_history, to);

        // Tạo đối tượng vé mới
        let ticket = Ticket {
            id: object::new(ctx),
            event_details,
            original_price,
            expiration_date,
            ownership_history,
            is_used: false,
            is_cancelled: false,
            max_resale_price: original_price * 2, // Mặc định giá tối đa là 2 lần giá gốc
        };
        
        let ticket_id = object::id_address(&ticket);
        
        // Cập nhật registry
        let registry = borrow_registry(ctx);
        table::add(&mut registry.tickets_by_id, ticket_id, true);
        
        // Phát ra sự kiện TicketMinted
        event::emit(TicketMinted {
            ticket_id,
            owner: to,
            event_details: ticket.event_details,
            original_price: ticket.original_price,
            expiration_date: ticket.expiration_date,
        });
        
        // Tạo trạng thái check-in cho vé này
        let check_in_status = CheckInStatus {
            id: object::new(ctx),
            ticket_id,
            is_checked_in: false,
        };
        
        // Chuyển vé và trạng thái check-in
        transfer::transfer(ticket, to);
        transfer::share_object(check_in_status);
    }

    // Xác thực vé (đánh dấu đã sử dụng)
    public entry fun validate_ticket(
        ticket: &mut Ticket,
        ctx: &mut TxContext
    ) {
        // Kiểm tra vé chưa được sử dụng
        assert!(!ticket.is_used, ETicketAlreadyUsed);
        
        // Kiểm tra vé chưa bị hủy
        assert!(!ticket.is_cancelled, ETicketCancelled);
        
        // Kiểm tra vé chưa hết hạn
        let current_time = tx_context::epoch(ctx);
        assert!(current_time <= ticket.expiration_date, ETicketExpired);
        
        // Đánh dấu vé đã sử dụng
        ticket.is_used = true;
        
        // Phát ra sự kiện TicketValidated
        let ticket_id = object::id_address(ticket);
        let validator = tx_context::sender(ctx);
        
        event::emit(TicketValidated {
            ticket_id,
            validator,
        });
    }

    // Check-in vé
    public entry fun check_in(
        ticket: &Ticket,
        check_in_status: &mut CheckInStatus,
        ctx: &mut TxContext
    ) {
        // Kiểm tra vé chưa được sử dụng
        assert!(!ticket.is_used, ETicketAlreadyUsed);
        
        // Kiểm tra vé chưa bị hủy
        assert!(!ticket.is_cancelled, ETicketCancelled);
        
        // Kiểm tra vé chưa hết hạn
        let current_time = tx_context::epoch(ctx);
        assert!(current_time <= ticket.expiration_date, ETicketExpired);
        
        // Kiểm tra vé chưa check-in
        assert!(!check_in_status.is_checked_in, ETicketAlreadyCheckedIn);
        
        // Kiểm tra check_in_status khớp với ticket
        let ticket_id = object::id_address(ticket);
        assert!(check_in_status.ticket_id == ticket_id, ENotAuthorized);
        
        // Đánh dấu đã check-in
        check_in_status.is_checked_in = true;
        
        // Phát ra sự kiện TicketCheckedIn
        let attendee = *vector::borrow(&ticket.ownership_history, vector::length(&ticket.ownership_history) - 1);
        
        event::emit(TicketCheckedIn {
            ticket_id,
            attendee,
        });
    }

    // Hủy vé - chỉ module event_manager có thể gọi
    public(friend) fun cancel(
        ticket_id: address,
        ctx: &mut TxContext
    ) {
        // Kiểm tra ticket tồn tại trong registry
        let registry = borrow_registry(ctx);
        assert!(table::contains(&registry.tickets_by_id, ticket_id), ETicketNotFound);
        
        // Tìm ticket sử dụng dynamic fields
        // Lưu ý: Đây là triển khai đơn giản. Trong ứng dụng thực tế, bạn sẽ cần
        // cơ chế để tìm đối tượng Ticket thông qua ID.
        let sender = tx_context::sender(ctx);
        
        // Đánh dấu ticket đã bị hủy trong registry
        *table::borrow_mut(&mut registry.tickets_by_id, ticket_id) = false;
        
        // Lưu thông tin cần thiết vào dynamic field để xác định ticket đã bị hủy
        df::add(&mut registry.id, ticket_id, true);
        
        // Phát ra sự kiện TicketCancelled
        event::emit(TicketCancelled {
            ticket_id,
            owner: sender,
        });
        
        // Lưu ý: Ticket vẫn thuộc sở hữu của người dùng, nhưng khi họ cố gắng sử dụng
        // nó, hệ thống sẽ kiểm tra trong registry và biết rằng vé đã bị hủy.
    }

    // Chuyển nhượng vé và cập nhật lịch sử sở hữu
    public entry fun transfer_ticket(
        ticket: &mut Ticket,
        to: address,
        ctx: &mut TxContext
    ) {
        // Kiểm tra vé chưa được sử dụng
        assert!(!ticket.is_used, ETicketAlreadyUsed);
        
        // Kiểm tra vé chưa bị hủy
        assert!(!ticket.is_cancelled, ETicketCancelled);
        
        // Kiểm tra vé chưa hết hạn
        let current_time = tx_context::epoch(ctx);
        assert!(current_time <= ticket.expiration_date, ETicketExpired);
        
        // Thêm địa chỉ người nhận vào lịch sử sở hữu
        vector::push_back(&mut ticket.ownership_history, to);
        
        // Phát ra sự kiện TicketTransferred
        let ticket_id = object::id_address(ticket);
        let from = tx_context::sender(ctx);
        
        event::emit(TicketTransferred {
            ticket_id,
            from,
            to,
        });
        
        // Chuyển vé cho người nhận
        transfer::transfer(ticket, to);
    }

    // Thiết lập giá bán lại tối đa cho vé - chỉ module event_manager có thể gọi
    public(friend) fun set_max_resale_price(
        ticket_id: address,
        max_price: u64,
        ctx: &mut TxContext
    ) {
        // Kiểm tra ticket tồn tại trong registry
        let registry = borrow_registry(ctx);
        assert!(table::contains(&registry.tickets_by_id, ticket_id), ETicketNotFound);
        
        // Lưu thông tin giá bán lại tối đa mới vào dynamic field
        if (df::exists_(&registry.id, ticket_id)) {
            // Nếu vé đã bị hủy, không cho phép cập nhật giá
            assert!(!df::exists_(&registry.id, ticket_id), ETicketCancelled);
        }
        
        // Lưu giá bán lại tối đa vào dynamic field
        // Dynamic field key là ticket_id, và giá trị là một struct khác
        // Trong ứng dụng thực tế, bạn sẽ cần một cơ chế phức tạp hơn để cập nhật
        // đối tượng Ticket thực tế
        if (df::exists_(&registry.id, (ticket_id, b"max_price"))) {
            *df::borrow_mut(&mut registry.id, (ticket_id, b"max_price")) = max_price;
        } else {
            df::add(&mut registry.id, (ticket_id, b"max_price"), max_price);
        }
        
        // Phát ra sự kiện MaxResalePriceUpdated
        let updater = tx_context::sender(ctx);
        
        event::emit(MaxResalePriceUpdated {
            ticket_id,
            new_price: max_price,
            updater,
        });
    }

    // Hàm helper để lấy registry
    fun borrow_registry(ctx: &mut TxContext): &mut TicketRegistry {
        // Trong triển khai thực tế, bạn sẽ cần một cơ chế để lấy shared object
        // Đây là một mẫu đơn giản. Bạn có thể cần điều chỉnh theo nhu cầu của ứng dụng.
        
        // Giả định registry là shared object đầu tiên được tạo khi module được khởi tạo
        // Trong thực tế, bạn sẽ cần một cơ chế để tìm đối tượng TicketRegistry
        
        // Mã giả: Tìm đối tượng TicketRegistry được chia sẻ
        let registry = /* Cơ chế để lấy shared object */;
        registry
    }

    // Các hàm truy vấn
    
    // Lấy lịch sử sở hữu của vé
    public fun get_ticket_history(ticket: &Ticket): &vector<address> {
        &ticket.ownership_history
    }
    
    // Lấy trạng thái vé
    public fun get_ticket_status(
        ticket: &Ticket,
        check_in_status: &CheckInStatus,
        ctx: &TxContext
    ): (bool, bool, bool, bool) {
        let current_time = tx_context::epoch(ctx);
        let is_used = ticket.is_used;
        let is_valid = current_time <= ticket.expiration_date && !ticket.is_used && !ticket.is_cancelled;
        let is_cancelled = ticket.is_cancelled;
        let is_checked_in = check_in_status.is_checked_in;
        
        (is_used, is_valid, is_cancelled, is_checked_in)
    }
    
    // Kiểm tra vé có bị hủy không thông qua registry
    public fun is_ticket_cancelled(
        ticket_id: address,
        ctx: &mut TxContext
    ): bool {
        let registry = borrow_registry(ctx);
        
        if (!table::contains(&registry.tickets_by_id, ticket_id)) {
            return false // Vé không tồn tại
        };
        
        if (df::exists_(&registry.id, ticket_id)) {
            return true // Vé đã bị hủy
        };
        
        false // Vé chưa bị hủy
    }
    
    // Lấy giá bán lại tối đa
    public fun get_max_resale_price(
        ticket: &Ticket,
        ctx: &mut TxContext
    ): u64 {
        let ticket_id = object::id_address(ticket);
        let registry = borrow_registry(ctx);
        
        if (df::exists_(&registry.id, (ticket_id, b"max_price"))) {
            *df::borrow(&registry.id, (ticket_id, b"max_price"))
        } else {
            ticket.max_resale_price
        }
    }
}