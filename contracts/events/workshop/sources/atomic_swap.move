module workshop::atomic_swap;
use sui::balance;
use sui::coin::{Coin, from_balance};
use sui::object;
use sui::token::recipient;
use sui::transfer;
use sui::tx_context::TxContext;
use workshop::sui_bootcamp::Sui_ticket;
use workshop::tick::TICK;

#[error]
const ERecipientNotMatch: u64 = 0;

public struct Atomic_swap has key {
    id: UID,
    sender: address,
    recipient: address,
    s_object: Sui_ticket,
    r_object: balance::Balance<TICK>,
    pass_price: u64,
}

public fun create(ticket: Sui_ticket, amount: u64, recipient: address, ctx: &mut TxContext) {
    transfer::share_object(Atomic_swap {
        id: object::new(ctx),
        sender: ctx.sender(),
        recipient,
        s_object: ticket,
        r_object: balance::zero(),
        pass_price: amount,
    });
}

public fun join_exchange(atomic_swap: &mut Atomic_swap, coin: Coin<TICK>, ctx: &mut TxContext) {
    assert!(atomic_swap.recipient == ctx.sender(), ERecipientNotMatch);
    balance::join(&mut atomic_swap.r_object, coin.into_balance());
}

public fun imple_swap(atomic_swap: Atomic_swap, ctx: &mut TxContext) {
    assert!(atomic_swap.r_object.value() >= atomic_swap.pass_price);
    let Atomic_swap { id, sender, recipient, s_object, r_object, pass_price } = atomic_swap;
    object::delete(id);
    transfer::public_transfer(s_object, recipient);
    transfer::public_transfer(sui::coin::from_balance(r_object, ctx), sender);
}

public fun return_to_owner(atomic_swap: Atomic_swap, ctx: &mut TxContext) {
    if (ctx.sender() == atomic_swap.sender || ctx.sender() == atomic_swap.recipient) {
        let Atomic_swap { id, sender, recipient, s_object, r_object, pass_price } = atomic_swap;
        object::delete(id);
        transfer::public_transfer(s_object, sender);
        transfer::public_transfer(sui::coin::from_balance(r_object, ctx), recipient);
    }
    else{
        abort(1);
    }
}
