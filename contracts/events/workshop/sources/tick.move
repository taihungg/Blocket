module workshop::tick;
use sui::url;
use sui::coin::{Self, CoinMetadata, TreasuryCap};
use bridge::treasury;
use sui_system::validator::metadata;
public struct TICK has drop{}
public struct PoolTick has key {
    id: UID,
    pool_tick: sui::balance::Balance<TICK>,
    pool_sui: sui::balance::Balance<sui::sui::SUI>
}
fun init(witness: TICK, ctx: &mut TxContext){
    let (mut treasury, metadata) = coin::create_currency(
        witness,
        6,
        b"TICK",
        b"tick token",
        b"using this TICK to buy event tickets",
        option::some(url::new_unsafe_from_bytes(b"")),
        ctx,
    );
    let tick_mint = sui::coin::mint(&mut treasury, 60000000, ctx);
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
public fun mint_tick(
    pool: &mut PoolTick, 
    mut coin_sui: coin::Coin<sui::sui::SUI>, 
    amount: u64, 
    ctx: &mut TxContext
){
    // Đảm bảo coin_sui có giá trị lớn hơn amount
    let coin_value = coin::value(&coin_sui);
    assert!(coin_value >= amount, ECoinNotEnough);

    // Tách coin_sui ra một lượng amount
    let extracted_coin = coin::split(&mut coin_sui, amount, ctx);

    // Thêm lượng SUI vừa tách vào pool_sui
    sui::balance::join(&mut pool.pool_sui, extracted_coin.into_balance());

    // Tính toán lượng TICK cần trích từ pool_tick
    let tick_amount = amount * 10000000;

    // Trích lượng TICK từ pool_tick
    // let tick_coin = sui::balance::withdraw(&mut pool.pool_tick, tick_amount, ctx);
    let tick_coin = sui::balance::split<TICK>(&mut pool.pool_tick, tick_amount);

    // Chuyển lượng TICK vừa trích cho recipient
    transfer::public_transfer(sui::coin::from_balance(tick_coin, ctx), ctx.sender());
    transfer::public_transfer(coin_sui, ctx.sender());
    // coin::from_balance(tick_coin, ctx)
}

public fun burn_tick(cap: &mut TreasuryCap<TICK>, c: coin::Coin<TICK>): u64{
    coin::burn(cap, c)
}