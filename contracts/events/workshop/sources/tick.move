module workshop::tick;
use sui::url;
use sui::coin::{Self, CoinMetadata, TreasuryCap};
use bridge::treasury;
use sui_system::validator::metadata;
public struct TICK has drop{}
fun init(witness: TICK, ctx: &mut TxContext){
    let (treasury, metadata) = coin::create_currency(
        witness,
        6,
        b"TICK",
        b"tick token",
        b"using this TICK to buy event tickets",
        option::some(url::new_unsafe_from_bytes(b"")),
        ctx,
    );
    transfer::public_transfer(treasury, ctx.sender());
    transfer::public_freeze_object(metadata);
}
public fun mint_tick(cap: &mut TreasuryCap<TICK>, recipient: address, ctx:&mut TxContext){
    let value = 10000000;
    let tick_mint:  coin::Coin<TICK> = coin::mint(cap, value, ctx);
    transfer::public_transfer(tick_mint, recipient);
}
public fun burn_tick(cap: &mut TreasuryCap<TICK>, c: coin::Coin<TICK>): u64{
    coin::burn(cap, c)
}