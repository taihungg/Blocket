module workshop::workshop;
use std::string::{Self, String};
use sui::coin::{Self, Coin};
use sui::url::{Self, Url};
use workshop::tick::TICK;

public struct Workshop has key {
    id: UID,
    event_name: string::String,
    ticket_price: u64,
    max_tickets: u64,
    description: string::String,
    image: Url,
    host: address,
}
public struct Ticket has key, store {
    id: UID,
    event_id: ID,
    description: String,
    image_url: Url,
    event_name: String,
}

//Trang web sở hữu mọi event - hết event thì burn đi - cho publisher xài
public fun create(
    host: address,
    ticket_price: u64,
    max_tickets: u64,
    event_name: vector<u8>,
    description: vector<u8>,
    image: vector<u8>,
    ctx: &mut TxContext,
) {
    transfer::share_object(Workshop {
        id: object::new(ctx),
        event_name: string::utf8(event_name),
        ticket_price,
        max_tickets,
        description: string::utf8(description),
        image: url::new_unsafe_from_bytes(image),
        host,
    });
}

fun mint_ticket(workshop: &mut Workshop, ctx: &mut TxContext): Ticket {
    Ticket {
        id: object::new(ctx),
        event_id: object::uid_to_inner(&workshop.id),
        description: workshop.description,
        image_url: url::new_unsafe_from_bytes(b""),
        event_name: workshop.event_name,
    }
}

public fun buy_ticket(buyer_coin: &mut Coin<TICK>, workshop: &mut Workshop, ctx: &mut TxContext) {
    assert!(workshop.max_tickets > 0, 0); // Ensure tickets are available
    assert!(coin::value(buyer_coin) >= workshop.ticket_price, 1); // Ensure buyer has enough funds

    // Deduct ticket price from buyer's coin
    let splited_coin = coin::split(buyer_coin, workshop.ticket_price, ctx);

    // Mint a new ticket for the buyer
    let ticket = mint_ticket(workshop, ctx);

    // Decrease the number of available tickets
    workshop.max_tickets = workshop.max_tickets - 1;

    // Transfer the ticket to the buyer
    transfer::public_transfer(ticket, tx_context::sender(ctx));
    transfer::public_transfer(splited_coin, workshop.host);
}

// public fun verify_ticket(ticket: &Ticket, workshop: &Workshop, ctx: &mut TxContext): bool {
//     assert!(ticket.event_id == object::uid_to_inner(&workshop.id), 0);
//     true
// }
