import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction } from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { useEffect, useState } from "react";
import axios from 'axios';
function Test() {
    const currAccount = useCurrentAccount();
    const { mutate: sae } = useSignAndExecuteTransaction();
    const [packageId, setPackageId] = useState('')
    const [poolId, setPoolId] = useState('')
    useEffect(() => {
        const fectch = async () => {
            axios.get('http://localhost:3000/get_package_id').then(res => {
                setPackageId(res.data.package_id);
            }).catch(e => console.log(e))

            axios.get('http://localhost:3000/get_pool_id').then(res => {
                setPoolId(res.data.pool_id);
            }).catch(e => console.log(e))
        }

        fectch();
    }, [])
    const run = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(3000000);
            // const [coin1, coin2] = tx.splitCoins(tx.gas, [tx.pure.u64(2000000), tx.pure.u64(2000000)]);
            // const res = tx.moveCall({
            //     target: `${packageId}::tick::mint_tick`,
            //     arguments: [
            //         tx.object(poolId),
            //         tx.pure.address(currAccount?.address),
            //         coin1,
            //         tx.pure.u64(1)
            //     ]
            // })
            // tx.transferObjects([coin2, ...res], tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'));
            const [coin1] = tx.splitCoins(tx.gas, [tx.pure.u64(2000000)]);
            const [lock, key] = tx.moveCall({
                target: `${packageId}::lock::lock`,
                arguments: [
                    coin1,
                ],
                typeArguments: ['0x2::coin::Coin<0x2::sui::SUI>']
            })
            tx.transferObjects([lock, key], tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'));
            sae({
                transaction: tx,
                account: currAccount ? currAccount : undefined,
                chain: 'sui:testnet',
            },
        {
            onSuccess: (res) => {console.log(res.digest)},
            onError: (e) => {console.log(e)}
        })
        }
        else{
            alert('fuck u')
        }
    }
    return (
        <div className="wrapper">
            <ConnectButton />
            <button onClick={run}> run now bruh</button>
        </div>
    );
}

export default Test;