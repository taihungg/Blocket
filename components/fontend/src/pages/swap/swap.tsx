import { useEffect, useState } from 'react';
import styles from './swap.module.scss';
import classNames from 'classnames/bind';
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import axios from 'axios';
import HeaderLayout from '../../layout/header.layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowsUpDown } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
function Swap() {
    const [packageId, setPackageId] = useState('');
    const [poolId, setPoolId] = useState('');
    const [suiCoin, setSuiCoin] = useState<number>(0);
    const [tickToken, setTickToken] = useState<number>(0);
    const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();
    const [clientSUI, setClientSUI] = useState<string>('');
    //0 : sui -> Tick
    //1: Tick -> sui
    const [exchangeMode, setExchangeMode] = useState(0);
    const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
        owner: currAccount?.address || '',
        options: {
            showType: true,
        },
    });

    useEffect(() => {
        const get_package_id = async () => {
            const data_res = await axios.get('http://localhost:3000/get_package_id');
            if (data_res.status === 200) {
                setPackageId(data_res.data.package_id)
            }
        }
        const get_pool_id = async () => {
            const data_res = await axios.get('http://localhost:3000/get_pool_id');
            if (data_res.status === 200) {
                setPoolId(data_res.data.pool_id)
            }
        }
        get_package_id();
        get_pool_id();
    }, [packageId, poolId])
    // Update `clientSUI` when `ownedObjects` changes
    useEffect(() => {
        if (ownedObjects) {
            const suiObject = ownedObjects.data?.find(obj => obj.data?.type === '0x2::coin::Coin<0x2::sui::SUI>');
            console.log(ownedObjects)
            setClientSUI(suiObject?.data?.objectId || '');
            // console.log(suiObject)
        }
    }, [ownedObjects]);

    const sui_to_tick = (value: string) => {
        if (value === '') {
            setSuiCoin(0);
            setTickToken(0);
        }
        else {
            const val = parseFloat(value);
            if (val) {
                setSuiCoin(parseFloat(value));
                setTickToken(parseFloat(value) * 10);
            }
        }
    };
    const tick_to_sui = (value: string) => {
        if (value === '') {
            setSuiCoin(0);
            setTickToken(0);
        }
        else {
            const val = parseFloat(value);
            if (val) {
                setSuiCoin(parseFloat(value) / 10);
                setTickToken(parseFloat(value));
            }
        }
    };

    const handleSwap = () => {
        if (currAccount) {
            if (suiCoin && tickToken) {
                if (suiCoin > 0 && tickToken > 0 && tickToken / suiCoin === 10) {
                    if (clientSUI) {
                        const tx = new Transaction();
                        tx.setGasBudget(6000000);
                        const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiCoin)]);
                        tx.moveCall({
                            target: `${packageId}::tick::mint_tick`,
                            arguments: [
                                tx.object(poolId),
                                coin,
                                tx.pure.u64(suiCoin)
                            ]
                        })
                        signAndExecuteTransaction(
                            {
                                transaction: tx,
                                account: currAccount,
                                chain: 'sui:testnet',
                            },
                            {
                                onSuccess: (result) => {
                                    alert('Swap successful');
                                    console.log(result.digest)
                                },
                                onError: (e) => {
                                    console.log(e)
                                    alert('Swap fail');
                                },
                            }
                        );
                    } else {
                        alert('your wallet must has SUI first');
                    }
                } else if (suiCoin === 0) {
                    alert('You must input your coin to imple swap');
                } else {
                    alert('invalid input coin');
                }
            }
        } else {
            alert('you need connect wallet first!');
        }
    };
    const handleChangeMode = () => {
        //0 : sui -> Tick
        //1: Tick -> sui
        if (exchangeMode == 0) {
            setExchangeMode(1)
        }
        if (exchangeMode == 1) {
            setExchangeMode(0)
        }
    }
    return (
        <HeaderLayout>
            <div className={cx('wrapper')}>
                {exchangeMode === 0 ?
                    <div className={cx('swap')}>
                        <div className={cx('token')}>
                            <h3>Sui token amount</h3>
                            <input type="text" value={suiCoin} onChange={(e) => sui_to_tick(e.target.value)} />
                        </div>
                        <div className={cx('swap-icon')} onClick={handleChangeMode}>
                            <FontAwesomeIcon icon={faArrowsUpDown} />
                        </div>

                        <div className={cx('tick')}>
                            <h3>Tick token receive</h3>
                            <input type="text" value={tickToken} readOnly />
                        </div>
                        <button className={cx('swap-btn')} onClick={handleSwap}>
                            Swap
                        </button>
                    </div>
                    :
                    <div className={cx('swap')}>
                        <div className={cx('tick')}>
                            <h3>Tick token amount</h3>
                            <input type="text" value={tickToken} onChange={(e) => tick_to_sui(e.target.value)} />
                        </div>
                        <div className={cx('swap-icon')} onClick={handleChangeMode}>
                            <FontAwesomeIcon icon={faArrowsUpDown} />
                        </div>
                        <div className={cx('token')}>
                            <h3>Sui token receive</h3>
                            <input type="text" value={suiCoin} readOnly />
                        </div>
                        <button className={cx('swap-btn')} onClick={handleSwap}>
                            Swap
                        </button>
                    </div>
                }
            </div>
        </HeaderLayout>
    );
}

export default Swap;