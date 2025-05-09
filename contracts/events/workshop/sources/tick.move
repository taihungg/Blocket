module workshop::tick;
use sui::url;
use sui::coin::{Self, TreasuryCap};
public struct TICK has drop{}
public struct PoolTick has key {
    id: UID,
    pool_tick: sui::balance::Balance<TICK>,
    pool_sui: sui::balance::Balance<sui::sui::SUI>
}
fun init(witness: TICK, ctx: &mut TxContext){
    let (mut treasury, metadata) = coin::create_currency(
        witness,
        9,
        b"TICK",
        b"tick token",
        b"using this TICK to buy event tickets",
        option::some(url::new_unsafe_from_bytes(b"")),
        ctx,
    );
    let tick_mint = sui::coin::mint(&mut treasury, 600000000000, ctx);
    let balance_init = tick_mint.into_balance();

    transfer::share_object(PoolTick{
        id: object::new(ctx),
        pool_tick: balance_init,
        pool_sui: sui::balance::zero()
    });
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_freeze_object(metadata);
}

#[error]
const ECoinNotEnough: u64 = 4;
#[error]
const ECoinInPoolNotEnough: u64 = 5;
public fun swap_sui_tick(
    pool: &mut PoolTick, 
    mut coin_sui: coin::Coin<sui::sui::SUI>, 
    amount: u64, 
    ctx: &mut TxContext
){
    let coin_value = coin::value(&coin_sui);
    assert!(coin_value >= amount, ECoinNotEnough);

    let extracted_coin = coin::split(&mut coin_sui, amount, ctx);

    let tick_amount = amount * 10;
    assert!(pool.pool_tick.value() >= tick_amount, ECoinInPoolNotEnough);
    let tick_coin = sui::balance::split<TICK>(&mut pool.pool_tick, tick_amount);

    sui::balance::join(&mut pool.pool_sui, extracted_coin.into_balance());
    transfer::public_transfer(sui::coin::from_balance(tick_coin, ctx), ctx.sender());
    transfer::public_transfer(coin_sui, ctx.sender());
}

public fun swap_tick_sui(
    pool: &mut PoolTick, 
    mut tick: coin::Coin<TICK>,
    amount: u64, 
    ctx: &mut TxContext
){
    let coin_value = coin::value(&tick);
    assert!(coin_value >= amount, ECoinNotEnough);

    let extracted_coin = coin::split(&mut tick, amount, ctx);

    let sui_amount = amount / 10;
    assert!(pool.pool_sui.value() >= sui_amount, ECoinInPoolNotEnough);

    let sui_coin = sui::balance::split<sui::sui::SUI>(&mut pool.pool_sui, sui_amount);

    sui::balance::join(&mut pool.pool_tick, extracted_coin.into_balance());
    transfer::public_transfer(sui::coin::from_balance(sui_coin, ctx), ctx.sender());
    transfer::public_transfer(tick, ctx.sender());
}
public fun burn_tick(cap: &mut TreasuryCap<TICK>, c: coin::Coin<TICK>): u64{
    coin::burn(cap, c)
}