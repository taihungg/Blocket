import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { SuiObjectResponse } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import axios from 'axios';
function Test() {
    const currAccount = useCurrentAccount();
    const { mutate: sae } = useSignAndExecuteTransaction();
    const [packageId, setPackageId] = useState('')
    const [poolId, setPoolId] = useState('')
    const client = useSuiClient();
    const [tickTokens, setTickTokens] = useState<SuiObjectResponse[] | undefined>(undefined);

    useEffect(() => {
        let package_id = '';
        const fectch = async () => {
            await axios.get('http://localhost:3000/get_package_id').then(res => {
                package_id = res.data.package_id;
                setPackageId(res.data.package_id);
            }).catch(e => console.log(e))

            await axios.get('http://localhost:3000/get_pool_id').then(res => {
                setPoolId(res.data.pool_id);
            }).catch(e => console.log(e))
        }
        const getOwnObject = async () => {
            if (currAccount) {
                const { data } = await client.getOwnedObjects({
                    owner: currAccount?.address,
                    options: {
                        showType: true,
                    }
                })
                console.log(data)
                if (data) {
                    const tick_tokens = data.find(obj =>
                        obj.data?.type === `0x2::coin::Coin<${package_id}::tick::TICK>`
                    )
                    setTickTokens(tick_tokens ? [tick_tokens] : undefined);

                }
            }
            
        }
        fectch();
        getOwnObject();
    }, [])
    const mint_tick = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(4000000);
            const coin = tx.splitCoins(tx.gas, [tx.pure.u64(3)]);
            tx.moveCall({
                target: `${packageId}::tick::mint_tick`,
                arguments: [
                    tx.object(poolId),
                    coin,
                    tx.pure.u64(1)
                ]
            })
            sae({
                transaction: tx,
                account: currAccount ? currAccount : undefined,
                chain: 'sui:testnet',
            },
                {
                    onSuccess: (res) => { console.log(res.digest) },
                    onError: (e) => { console.log(e) }
                })
        }
        else {
            alert('fuck u')
        }
    }
    const create_event = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(3000000);
            tx.moveCall({
                target: `${packageId}::workshop::create`,
                arguments: [
                    tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'),
                    tx.pure.u64(3),
                    tx.pure.u64(64),
                    tx.pure.string('hello'),
                    tx.pure.string('Event make your day'),
                    tx.pure.string(''),
                ]
            })
            sae({
                transaction: tx,
                account: currAccount ? currAccount : undefined,
                chain: 'sui:testnet',
            },
                {
                    onSuccess: (res) => { console.log(res.digest) },
                    onError: (e) => { console.log(e) }
                })
        }
        else {
            alert('fuck u')
        }
    }
    const buy_ticket = () => {
        console.log(tickTokens)
        if (currAccount) {
            const tick_token = tickTokens?.[0];
            if (tick_token) {
                const tx = new Transaction();
                tx.setGasBudget(6000000);
                tx.moveCall({
                    target: `${packageId}::workshop::buy_ticket`,
                    arguments: [
                        tx.object(tick_token.data?.objectId ?? ''),
                        tx.object('0x0ad1b2741eafa49ca8c8dfa888a06bb64902f090d4e19359f69bea93e5488f58'),
                    ]
                })
                sae({
                    transaction: tx,
                    account: currAccount ? currAccount : undefined,
                    chain: 'sui:testnet',
                },
                    {
                        onSuccess: (res) => { console.log(res.digest) },
                        onError: (e) => { console.log(e) }
                    })

            }
        }
        else {
            alert('fuck u')
        }
    }
    return (
        <div className="wrapper">
            <ConnectButton />
            <p></p>
            <button onClick={mint_tick}>mint tick</button>
            <p></p>
            <button onClick={create_event}>create event</button>
            <p></p>
            <button onClick={buy_ticket}>buy ticket</button>
        </div>
    );
}

export default Test;