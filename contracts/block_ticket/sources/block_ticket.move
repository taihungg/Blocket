/*
/// Module: block_ticket
*/

// For Move coding conventions, see
// https://docs.sui.io/concepts/sui-move-concepts/conventions

module block_ticket::block_ticket{
    public struct Ticket has key, store{
        id: UID,
        name: std::string::String,
        concert_id: std::string::String,
        image_url: sui::url::Url
    }

    public fun mint_ticket(name: std::string::String, concert_id: std::string::String, image: std::string::String, recipient: address, ctx: &mut TxContext){
        let ticket = Ticket{
            id: object::new(ctx),
            name,
            concert_id,
            image_url: sui::url::new_unsafe_from_bytes(*image.as_bytes())
        };
        transfer::public_transfer(ticket, recipient);
    }
}


