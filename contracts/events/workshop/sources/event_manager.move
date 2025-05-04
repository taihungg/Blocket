module event_chain::event_manager {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::event;
    use std::string::{Self, String};
    use std::vector;
    use event_chain::ticket;

    // Lỗi
    const ENotAuthorized: u64 = 0;
    const EAllTicketsSold: u64 = 1;

    // Cấu trúc quản lý sự kiện
    struct Event has key, store {
        id: UID,
        name: String,
        location: String,
        date: String, 
        ticket_price: u64,
        organizer: address,
        max_tickets: u64,
        tickets_sold: u64,
    }

    // Chứng chỉ admin cho người tổ chức sự kiện
    struct EventManagerCap has key, store {
        id: UID,
        event_id: address,
    }

    // Các sự kiện
    struct EventCreated has copy, drop {
        event_id: address,
        name: String,
        location: String,
        date: String,
        ticket_price: u64,
        organizer: address,
        max_tickets: u64,
    }
    
    struct EventTransferred has copy, drop {
        event_id: address,
        from: address,
        to: address,
    }

    // Khởi tạo module
    fun init(_ctx: &mut TxContext) {}

    // Tạo sự kiện mới
    public entry fun create_event(
        name: vector<u8>,
        location: vector<u8>,
        date: vector<u8>,
        ticket_price: u64,
        max_tickets: u64,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        
        // Tạo đối tượng sự kiện mới
        let event = Event {
            id: object::new(ctx),
            name: string::utf8(name),
            location: string::utf8(location),
            date: string::utf8(date),
            ticket_price,
            organizer: sender,
            max_tickets,
            tickets_sold: 0,
        };
        
        let event_id = object::id_address(&event);
        
        // Tạo capability cho người tổ chức
        let cap = EventManagerCap {
            id: object::new(ctx),
            event_id,
        };
        
        // Phát ra sự kiện EventCreated
        event::emit(EventCreated {
            event_id,
            name: event.name,
            location: event.location,
            date: event.date,
            ticket_price: event.ticket_price,
            organizer: event.organizer,
            max_tickets: event.max_tickets,
        });
        
        // Chuyển đối tượng sự kiện và capability cho người tạo
        transfer::share_object(event);
        transfer::transfer(cap, sender);
    }

    // Phát hành vé
    public entry fun mint_ticket(
        event: &mut Event,
        cap: &EventManagerCap,
        to: address,
        event_details_bytes: vector<u8>,
        url_bytes: vector<u8>,
        expiration_date: u64,
        ctx: &mut TxContext
    ) {
        // Xác minh người gọi là người tổ chức sự kiện
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, ENotAuthorized);
        
        // Xác minh capability khớp với sự kiện
        let event_id = object::id_address(event);
        assert!(cap.event_id == event_id, ENotAuthorized);
        
        // Kiểm tra còn vé không
        assert!(event.tickets_sold < event.max_tickets, EAllTicketsSold);
        
        // Tăng số lượng vé đã bán
        event.tickets_sold = event.tickets_sold + 1;

        // Chuyển đổi thông tin từ bytes to string
        let event_details = string::utf8(event_details_bytes);
        
        // Gọi hàm mint từ module ticket
        ticket::mint(
            to,
            event_details,
            event.ticket_price,
            expiration_date,
            url_bytes,
            ctx
        );
    }

    // Phát hành nhiều vé cùng lúc
    public entry fun mint_multiple_tickets(
        event: &mut Event,
        cap: &EventManagerCap,
        recipients: vector<address>,
        event_details_bytes: vector<u8>,
        url_bytes: vector<u8>,
        expiration_date: u64,
        ctx: &mut TxContext
    ) {
        // Xác minh người gọi là người tổ chức sự kiện
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, ENotAuthorized);
        
        // Xác minh capability khớp với sự kiện
        let event_id = object::id_address(event);
        assert!(cap.event_id == event_id, ENotAuthorized);
        
        // Kiểm tra số lượng vé có đủ không
        let num_recipients = vector::length(&recipients);
        assert!(event.tickets_sold + num_recipients <= event.max_tickets, EAllTicketsSold);
        
        // Cập nhật số lượng vé đã bán
        event.tickets_sold = event.tickets_sold + num_recipients;

        // Chuyển đổi event_details từ bytes thành string
        let event_details_str = string::utf8(event_details_bytes);
        
        // Phát hành vé cho từng người nhận
        let i = 0;
        while (i < num_recipients) {
            let recipient = *vector::borrow(&recipients, i);
            
            // Gọi hàm mint từ module ticket
            ticket::mint(
                recipient,
                event_details_str,
                event.ticket_price,
                expiration_date,
                url_bytes,
                ctx
            );
            
            i = i + 1;
        }
    }

    // Hủy vé
    public entry fun cancel_ticket(
        event: &Event,
        cap: &EventManagerCap,
        ticket_id: address,
        ctx: &mut TxContext
    ) {
        // Xác minh người gọi là người tổ chức sự kiện
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, ENotAuthorized);
        
        // Xác minh capability khớp với sự kiện
        let event_id = object::id_address(event);
        assert!(cap.event_id == event_id, ENotAuthorized);
        
        // Gọi hàm cancel từ module ticket
        ticket::cancel(ticket_id, ctx);
    }

    // Thiết lập giá bán lại tối đa cho vé
    public entry fun set_max_resale_price(
        event: &Event,
        cap: &EventManagerCap,
        ticket_id: address,
        max_price: u64,
        ctx: &mut TxContext
    ) {
        // Xác minh người gọi là người tổ chức sự kiện
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, ENotAuthorized);
        
        // Xác minh capability khớp với sự kiện
        let event_id = object::id_address(event);
        assert!(cap.event_id == event_id, ENotAuthorized);
        
        // Gọi hàm set_max_resale_price từ module ticket
        ticket::set_max_resale_price(ticket_id, max_price, ctx);
    }
    
    // Chuyển nhượng quyền sở hữu sự kiện
    public entry fun transfer_event_ownership(
        event: &mut Event,
        cap: &EventManagerCap,
        to: address,
        ctx: &mut TxContext
    ) {
        // Xác minh người gọi là người tổ chức sự kiện
        let sender = tx_context::sender(ctx);
        assert!(event.organizer == sender, ENotAuthorized);
        
        // Xác minh capability khớp với sự kiện
        let event_id = object::id_address(event);
        assert!(cap.event_id == event_id, ENotAuthorized);
        
        // Tạo capability mới cho người nhận và chuyển quyền sở hữu
        let new_cap = EventManagerCap {
            id: object::new(ctx),
            event_id,
        };
        
        // Cập nhật người tổ chức trong đối tượng sự kiện
        event.organizer = to;
        
        // Phát ra sự kiện EventTransferred
        event::emit(EventTransferred {
            event_id,
            from: sender,
            to,
        });
        
        // Chuyển capability mới cho người nhận
        transfer::transfer(new_cap, to);
    }
    
    // Lấy thông tin sự kiện
    public fun get_event_details(event: &Event): (String, String, String, u64, address, u64, u64) {
        (
            event.name,
            event.location,
            event.date,
            event.ticket_price,
            event.organizer,
            event.max_tickets,
            event.tickets_sold
        )
    }
}