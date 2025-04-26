module workshop::sui_bootcamp;

use std::string::{Self, String};
use sui::balance::{Self, Balance};
use sui::coin::{Self, Coin};
use sui::url::{Self, Url};
use workshop::tick::TICK;

public struct Workshop has key {
    id: UID,
    price_per_ticket: u64,
    limited_members: u64,
    host: address,
    // balance: Balance<TICK>
}
public struct Sui_ticket has key, store {
    id: UID,
    event_id: ID,
    name: String,
    description: String,
    event_name: String,
    image_url: Url,
}

//Trang web sở hữu mọi event - hết event thì burn đi - cho publisher xài
public fun create(host: address, price_per_ticket: u64, limited_members: u64, ctx: &mut TxContext) {
    transfer::share_object(Workshop {
        id: object::new(ctx),
        price_per_ticket,
        limited_members,
        host,
    });
}

fun mint_ticket(workshop: &mut Workshop, ctx: &mut TxContext): Sui_ticket {
    Sui_ticket {
        id: object::new(ctx),
        event_id: object::uid_to_inner(&workshop.id),
        name: string::utf8(b"sui visitor"),
        description: string::utf8(b"sui ticket description"),
        event_name: string::utf8(b"sui bootcamp"),
        image_url: url::new_unsafe_from_bytes(b""),
    }
}

public fun buy_ticket(buyer_coin: &mut Coin<TICK>, workshop: &mut Workshop, ctx: &mut TxContext) {
    assert!(workshop.limited_members != 0, 0);
    assert!(buyer_coin.value() >= workshop.price_per_ticket, 1);

    let coin_split = buyer_coin.split(workshop.price_per_ticket, ctx);
    let ticket = mint_ticket(workshop, ctx);

    workshop.limited_members = workshop.limited_members - 1;
    transfer::public_transfer(ticket, ctx.sender());
    transfer::public_transfer(coin_split, workshop.host);
}

public fun verify_ticket(ticket: &Sui_ticket, workshop: &Workshop, ctx: &mut TxContext): bool {
    assert!(ticket.event_id == object::uid_to_inner(&workshop.id), 0);
    true
}

// public fun exchange(
//     ticket: Sui_ticket,
//     ticket_holder: address,
//     price_ticket: u64,
//     tick_token: &mut Coin<TICK>,
//     token_holder: address,
//     workshop:Workshop,
//     ctx: &mut TxContext,
// ) {
//     assert!(verify_ticket(&ticket, &workshop, ctx), 3);
//     assert!(tick_token.value() >= price_ticket, 4);

//     let token_split = tick_token.split(price_ticket, ctx);
//     transfer::public_transfer(token_split, ticket_holder);
//     transfer::public_transfer(ticket, token_holder);
//     transfer::share_object(workshop);
// }
