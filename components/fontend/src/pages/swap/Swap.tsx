import classNames from 'classnames/bind';
import styles from './Swap.module.scss';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { coin_unit, PACKAGE_ID, POOL_TICK } from '../../App';
import { Link } from 'react-router';

const cx = classNames.bind(styles);

function Swap() {
    //SUI
    const client = useSuiClient();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();
    const currAccount = useCurrentAccount();

    //states
    const [suiInput, setSuiInput] = useState<number>(0);
    const [tickInput, setTickInput] = useState<number>(0);
    const [mode, setMode] = useState(1); //0: sui->tick || 1: tick -> sui
    const [clientTICK, setClientTICK] = useState('');

    //useEffect
    useEffect(() => {
        const run = async () => {
            if (currAccount) {
                const tokens = await client.getOwnedObjects({
                    owner: currAccount?.address,
                    filter: {
                        StructType: `0x2::coin::Coin<${PACKAGE_ID}::tick::TICK>`
                    },
                    options: {
                        showContent: true
                    }
                });
                if (tokens) {
                    setClientTICK(tokens.data[0].data?.objectId ?? '')
                }
            }
        }
        run();
    }, [currAccount])

    const handleChangeMode = () => {
        if (mode === 1) {
            //sui->tick
            setMode(0);
            setSuiInput(tickInput);
            setTickInput(tickInput * 10);
        }
        else if (mode === 0) {
            setMode(1)
            setTickInput(suiInput);
            setSuiInput(suiInput / 10);
        }
    }
    const handleChangeBalanceInput = (input: string) => {
        if (input === '') {
            setSuiInput(0);
            setTickInput(0)
        }
        if (mode === 0) {
            //sui -> tick
            const sui_balance = parseFloat(input);
            if (sui_balance && sui_balance >= 0) {
                setSuiInput(sui_balance);
                setTickInput(sui_balance * 10)
            }
        }
        else if (mode === 1) {
            const tick_balance = parseFloat(input);
            if (tick_balance && tick_balance >= 0) {
                setTickInput(tick_balance);
                setSuiInput(tick_balance / 10);
            }
        }
        else { }
    }
    const handleSwapToken = (mode: number) => {
        if (currAccount) {
            if (suiInput > 0 && tickInput > 0 && tickInput / suiInput === 10) {
                const tx = new Transaction();
                if (mode === 0) {
                    tx.setGasBudget(6000000);
                    const [coin] = tx.splitCoins(tx.gas, [tx.pure.u64(suiInput * coin_unit)]);
                    tx.moveCall({
                        target: `${PACKAGE_ID}::tick::swap_sui_tick`,
                        arguments: [
                            tx.object(POOL_TICK),
                            coin,
                            tx.pure.u64(suiInput * coin_unit)
                        ]
                    })
                    sign_execute(
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

                }
                else if (mode === 1) {
                    tx.setGasBudget(6000000);
                    tx.moveCall({
                        target: `${PACKAGE_ID}::tick::swap_tick_sui`,
                        arguments: [
                            tx.object(POOL_TICK),
                            tx.object(clientTICK),
                            tx.pure.u64(tickInput * coin_unit)
                        ]
                    })
                    sign_execute(
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
                }
            }
        }
    }
    return (
        <div className={`${cx('wrapper', 'gradient-bg')} min-h-screen  text-white font-sans`}>
            <div className={`${cx('container')} mx-auto px-4 py-8`}>
                {/* <!-- Header --> */}
                <header className={`${cx('header')}  flex justify-between items-center mb-8`}>

                    <div className='flex items-center border border-blue-600 rounded-lg p-2 '>
                        <i className="fas fa-home text-2xl mr-2"></i>
                        <Link to='/'>
                            <h1 className={`${cx('title')} text-2xl font-bold cursor-pointer`}> Dash board</h1>
                        </Link>
                    </div>
                    <div className={`${cx('header-left')} flex items-center`}>
                        <i className="fas fa-exchange-alt text-2xl mr-2"></i>
                        <h1 className={`${cx('title')} text-2xl font-bold`}>CryptoSwap</h1>
                    </div>
                    <div className={`${cx('header-right')} flex space-x-4`}>
                        <button className={`${cx('connect-wallet-btn')} px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition`}>
                            <i className="fas fa-wallet mr-2"></i>
                            {currAccount ?
                                currAccount.address.length > 10 ? currAccount.address.slice(0, 6) + '...' + currAccount.address.slice(-4) : currAccount.address
                                : 'not connected'}
                        </button>
                        <button className={`${cx('settings-btn')} w-10 h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center`}>
                            <i className="fas fa-cog"></i>
                        </button>
                    </div>
                </header>

                {/* <!-- Main Swap Card --> */}
                <div className={`${cx('token-card')} max-w-md mx-auto rounded-2xl p-6 shadow-xl`}>
                    <div className={`${cx('swap-header')} flex justify-between items-center mb-4`}>
                        <h2 className={`${cx('swap-title')} text-xl font-semibold`}>Swap Tokens</h2>
                        <div className={`${cx('swap-actions')} flex space-x-2`}>
                            <button className={`${cx('max-btn')} px-3 py-1 rounded-md bg-white bg-opacity-10 text-sm`}>Max</button>
                            <button className={`${cx('half-btn')} px-3 py-1 rounded-md bg-white bg-opacity-10 text-sm`}>Half</button>
                        </div>
                    </div>

                    {/* <!-- From Token --> */}
                    <div className={`${cx('from-token')} mb-6`}>
                        <div className={`${cx('from-header')} flex justify-between items-center mb-2`}>
                            <label className={`${cx('from-label')} text-sm opacity-80`}>From</label>
                            <span className={`${cx('from-balance')} text-sm`}>Balance: 2.45</span>
                        </div>
                        <div className={`${cx('from-input-wrapper')} flex items-center bg-white bg-opacity-10 rounded-xl p-3`}>
                            <input id='sui-input' type="number" placeholder="0.0"
                                className={`${cx('from-input')} bg-transparent w-full text-2xl outline-none`}
                                onChange={e => handleChangeBalanceInput(e.target.value)}
                            />
                            <div className={`${cx('token-selector')} flex items-center bg-white bg-opacity-10 rounded-lg px-3 py-2 ml-2 cursor-pointer`}>
                                <img src={mode === 0 ? "sui_logo.png" : "blocket_logo.jpg"} alt="ETH" className="w-6 h-6 mr-2" />
                                <span className={`${cx('token-name')} font-medium mr-2`}>{mode === 0 ? 'SUI' : 'TICK'}</span>
                                {/* <i className="fas fa-chevron-down ml-2 text-xs"></i> */}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Swap Button --> */}
                    <div className={`${cx('swap-button-wrapper')} flex justify-center my-3`}>
                        <button id="swapDirection" className={`${cx('swap-button')} w-12 h-12 rounded-full bg-white bg-opacity-20 flex items-center justify-center hover:bg-opacity-30 transition`}
                            onClick={handleChangeMode}
                        >
                            <i className="fas fa-arrow-down text-xl"></i>
                        </button>
                    </div>

                    {/* <!-- To Token --> */}
                    <div className={`${cx('to-token')} mb-6`}>
                        <div className={`${cx('to-header')} flex justify-between items-center mb-2`}>
                            <label className={`${cx('to-label')} text-sm opacity-80`}>To</label>
                            <span className={`${cx('to-balance')} text-sm`}>Balance: 0.00</span>
                        </div>
                        <div className={`${cx('to-input-wrapper')} flex items-center bg-white bg-opacity-10 rounded-xl p-3`}>
                            <input id='tick-input' type="number" placeholder="0.0"
                                className={`${cx('to-input')} bg-transparent w-full text-2xl outline-none`}
                                value={mode === 0 ? tickInput : suiInput}
                                readOnly
                            />
                            <div className={`${cx('token-selector')} flex items-center bg-white bg-opacity-10 rounded-lg px-3 py-2 ml-2 cursor-pointer`}>
                                <img src={mode === 1 ? "sui_logo.png" : "blocket_logo.jpg"} alt="USDC" className="w-6 h-6 mr-2" />
                                <span className={`${cx('token-name')} font-medium mr-2`}>{mode === 1 ? 'SUI' : 'TICK'}</span>
                                {/* <i className="fas fa-chevron-down ml-2 text-xs"></i> */}
                            </div>
                        </div>
                    </div>

                    {/* <!-- Price Info --> */}
                    <div className={`${cx('price-info')} bg-white bg-opacity-5 rounded-xl p-4 mb-6`}>
                        <div className={`${cx('exchange-rate')} flex justify-between text-sm mb-2`}>
                            <span className={`${cx('rate-label')} opacity-70`}>Exchange Rate</span>
                            <span className={`${cx('rate-value')}`}>1 ETH = 1,850.42 USDC</span>
                        </div>
                        <div className={`${cx('slippage-tolerance')} flex justify-between text-sm`}>
                            <span className={`${cx('slippage-label')} opacity-70`}>Slippage Tolerance</span>
                            <span className={`${cx('slippage-value')}`}>0.5%</span>
                        </div>
                    </div>

                    {/* <!-- Swap Button --> */}
                    <button className={`${cx('swap-btn')} w-full py-4 rounded-xl bg-blue-500 text-white font-bold text-lg hover:bg-blue-600`}
                        onClick={() => handleSwapToken(mode)}
                    >
                        Swap Tokens
                    </button>
                </div>

                {/* <!-- Token Modal (hidden by default) --> */}
                <div id="tokenModal" className={`${cx('token-modal')} fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden`}>
                    <div className={`${cx('token-card')} rounded-2xl p-6 w-full max-w-md`}>
                        <div className={`${cx('modal-header')} flex justify-between items-center mb-4`}>
                            <h3 className={`${cx('modal-title')} text-lg font-semibold`}>Select a Token</h3>
                            <button id="closeModal" className={`${cx('close-modal-btn')} text-xl`}>&times;</button>
                        </div>
                        <div className={`${cx('search-wrapper')} relative mb-4`}>
                            <input type="text" placeholder="Search token name or paste address"
                                className={`${cx('search-input')} w-full bg-white bg-opacity-10 rounded-xl px-4 py-3 outline-none`} />
                            <i className="fas fa-search absolute right-4 top-3.5 opacity-70"></i>
                        </div>
                        <div className={`${cx('token-list')} max-h-96 overflow-y-auto`}>
                            <div className={`${cx('token-item')} flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer mb-2`}>
                                <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png" alt="ETH" className="w-8 h-8 mr-3" />
                                <div>
                                    <div className={`${cx('token-name')} font-medium`}>Ethereum</div>
                                    <div className={`${cx('token-symbol')} text-sm opacity-70`}>ETH</div>
                                </div>
                            </div>
                            <div className={`${cx('token-item')} flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer mb-2`}>
                                <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.png" alt="USDC" className="w-8 h-8 mr-3" />
                                <div>
                                    <div className={`${cx('token-name')} font-medium`}>USD Coin</div>
                                    <div className={`${cx('token-symbol')} text-sm opacity-70`}>USDC</div>
                                </div>
                            </div>
                            <div className={`${cx('token-item')} flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer mb-2`}>
                                <img src="https://cryptologos.cc/logos/tether-usdt-logo.png" alt="USDT" className="w-8 h-8 mr-3" />
                                <div>
                                    <div className={`${cx('token-name')} font-medium`}>Tether</div>
                                    <div className={`${cx('token-symbol')} text-sm opacity-70`}>USDT</div>
                                </div>
                            </div>
                            <div className={`${cx('token-item')} flex items-center p-3 hover:bg-white hover:bg-opacity-10 rounded-lg cursor-pointer mb-2`}>
                                <img src="https://cryptologos.cc/logos/bnb-bnb-logo.png" alt="BNB" className="w-8 h-8 mr-3" />
                                <div>
                                    <div className={`${cx('token-name')} font-medium`}>Binance Coin</div>
                                    <div className={`${cx('token-symbol')} text-sm opacity-70`}>BNB</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Swap;