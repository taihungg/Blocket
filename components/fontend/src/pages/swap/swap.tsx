import { useEffect, useState } from 'react';
import styles from './swap.module.scss';
import classNames from 'classnames/bind';
import { getSuiClientQuery, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { fromBase64 } from '@mysten/sui/utils';
import { queryOptions } from '@tanstack/react-query';
import { SuiClient } from '@mysten/sui/client';

const cx = classNames.bind(styles);
function Swap() {
    const [inputCoin, setInputCoin] = useState<number>();
    const [tickToken, setTickToken] = useState<number>(0);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();
    const [clientSUI, setClientSUI] = useState<string>('');
    const client = useSuiClient();

    const package_id = '0x0235fe85da0560a510cfdd1e0eca805f93a1fe64b6f9da965f528e6f10cf8594';
    const pool = '0x383fd9b273d82f789e19689dc386d0f821e9f5686a0d81c5736c4e233939ea30';

    // Use `useSuiClientQuery` at the top level
    const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
        owner: currAccount?.address || '',
        options: {
            showType: true,
        },
    });

    // Update `clientSUI` when `ownedObjects` changes
    useEffect(() => {
        if (ownedObjects) {
            const suiObject = ownedObjects.data?.find(obj => obj.data?.type === '0x2::coin::Coin<0x2::sui::SUI>');
            setClientSUI(suiObject?.data?.objectId || '');
            console.log(suiObject)
        }
    }, [ownedObjects]);

    const handleInputCoin = (value: string) => {
        if (value === '') setTickToken(0);

        const val = parseInt(value);

        if (val) {
            setInputCoin(parseInt(value));
            setTickToken(parseInt(value) * 10);
        }
    };

    const handleSwap = () => {
        if (currAccount) {
            if (inputCoin && tickToken) {
                if (inputCoin > 0 && tickToken > 0 && tickToken / inputCoin === 10) {
                    if (clientSUI) {
                        const tx = new Transaction();
                        tx.setGasBudget(3000000);
                        // const [newCoin] = tx.splitCoins(tx.object(clientSUI), [tx.pure.u64(inputCoin)]);
                        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(3)]);

                        tx.moveCall({
                            target: `${package_id}::tick::mint_tick`,
                            arguments: [
                                tx.object(pool),
                                tx.pure.address(currAccount.address),
                                tx.object(coin),
                                tx.pure.u64(inputCoin),
                            ],
                        });
                        signAndExecuteTransaction(
                            {
                                transaction: tx,
                                account: currAccount,
                                chain: 'sui:testnet',
                            },
                            {
                                onSuccess: () => {
                                    alert('Swap successful');
                                },
                                onError: () => {
                                    alert('Swap fail');
                                },
                            }
                        );
                    } else {
                        alert('your wallet must has SUI first');
                    }
                } else if (inputCoin === 0) {
                    alert('You must input your coin to imple swap');
                } else {
                    alert('invalid input coin');
                }
            }
        } else {
            alert('you need connect wallet first!');
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('swap')}>
                <div className={cx('token')}>
                    <h3>Input your coin (SUI)</h3>
                    <input type="text" onChange={(e) => handleInputCoin(e.target.value)} />
                </div>
                <div className={cx('tick')}>
                    <h3>Tick token receive</h3>
                    <input type="text" value={tickToken} readOnly />
                </div>
                <button className={cx('swap-btn')} onClick={handleSwap}>
                    Buy
                </button>
            </div>
        </div>
    );
}

export default Swap;