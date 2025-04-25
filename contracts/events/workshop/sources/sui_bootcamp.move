module workshop::sui_bootcamp;
use std::{
    string::{Self, String},
};
use sui::{
    url::{Self, Url},
    coin::{Self, Coin},
    balance::{Self, Balance}
};
use workshop::tick::TICK;
public struct Workshop has key{
    id: UID,
    price_per_ticket: u64,
    limited_members: u64, 
    balance: Balance<TICK>
}
public struct Sui_ticket has key, store{
    id: UID,
    event_id: ID,
    name: String,
    description: String,
    event_name: String,
    image_url: Url
}
fun init(ctx: &mut TxContext){
    transfer::transfer(Workshop{
        id: object::new(ctx),
        price_per_ticket: 32,
        limited_members: 32, 
        balance: balance::zero()
    }, ctx.sender());
}

public fun mint_ticket(workshop: &mut Workshop, ctx: &mut TxContext): Sui_ticket{
    Sui_ticket {
        id: object::new(ctx),
        event_id: object::uid_to_inner(&workshop.id),
        name: string::utf8(b""),
        description: string::utf8(b""),
        event_name: string::utf8(b""),
        image_url: url::new_unsafe_from_bytes(b"")
    }
}
public fun buy_ticket(workshop: &mut Workshop, buyer_coin: &mut Coin<TICK>, ctx: &mut TxContext){
    assert!(workshop.limited_members != 0, 0);
    assert!(buyer_coin.value() >= workshop.price_per_ticket, 1);
    let coin_split = buyer_coin.split(workshop.price_per_ticket, ctx);
    let balance_coin_split = coin_split.into_balance();
    workshop.balance.join(balance_coin_split);
    workshop.limited_members = workshop.limited_members - 1;

    let ticket = mint_ticket(workshop, ctx);
    transfer::public_transfer(ticket, ctx.sender());
}
public fun exchange(
    ticket: Sui_ticket, 
    c: Coin<TICK>, 
    seller: address, 
    buyer: address, 
    ctx: &mut TxContext
){
    
}
public fun share_object(){

}