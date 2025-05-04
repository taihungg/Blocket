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
            await axios.get('http://localhost:3000/get_package_id').then(res => {
                setPackageId(res.data.package_id);
            }).catch(e => console.log(e))

            await axios.get('http://localhost:3000/get_pool_id').then(res => {
                setPoolId(res.data.pool_id);
            }).catch(e => console.log(e))
        }

        fectch();
    }, [])
    const run = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(3000000);
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
            onSuccess: (res) => {console.log(res.digest)},
            onError: (e) => {console.log(e)}
        })
        }
        else{
            alert('fuck u')
        }
    }
    console.log(packageId, poolId)
    return (
        <div className="wrapper">
            <ConnectButton />
            <button onClick={run}> run now bruh</button>
        </div>
    );
}

export default Test;