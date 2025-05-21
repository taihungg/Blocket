import classNames from 'classnames/bind';
import styles from './BuyTicket.module.scss';
import { useEffect, useState } from 'react';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { dexInfo } from '../maketplace/maketplace';
import { coin_unit, PACKAGE_ID } from '../../App';
import { Transaction } from '@mysten/sui/transactions';
import { TicketInfo } from '../collection/collection';

const cx = classNames.bind(styles);
interface ExchangeResult {
    txHash: string;
    balance: string;
    ticket_name: string;
}
function BuyTicket() {
    //sui
    const currAccount = useCurrentAccount();
    const client = useSuiClient();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();

    //state
    const [currDex, setCurrDex] = useState<dexInfo>();
    const [inputDexId, setInputDexId] = useState('');
    const [tickId, setTickId] = useState('');
    const [exchangeResult, setExchangeResult] = useState<ExchangeResult | null>(null);

    //useEffect
    useEffect(() => {
        const fetchData = async () => {
            const allAssets = await getAllAssets();
            if (allAssets.length > 0) {
                setTickId(allAssets[0].id);
            }
        }
        fetchData();
    }, [])

    //functions
    const getAllAssets = async () => {
        let return_value: TicketInfo[] = [];
        if (currAccount) {
            let items = await client.getOwnedObjects({
                owner: currAccount.address,
                filter: {
                    StructType: `${PACKAGE_ID}::workshop::Ticket`
                },
                options: {
                    showContent: true,
                }
            })
            return_value = items.data
                .map((item: any) => item.data?.content?.fields)
                .filter((fields: any) => fields !== undefined);

            return_value.map(value => {
                value.id = (value.id as any).id
            })
        }
        return return_value;
    }
    const handleSearchDexId = async (value: string) => {
        const dexId = await client.getObject({
            id: value,
            options: {
                showType: true,
                showContent: true,
            }
        });
        if (dexId.data?.type === `${PACKAGE_ID}::atomic_swap::Atomic_swap`) {
            if (dexId && dexId.data && dexId.data.content) {
                const dex_info = (dexId.data.content as any).fields;
                setCurrDex({
                    id: dex_info.id.id,
                    pass_price: dex_info.pass_price,
                    sender: dex_info.sender,
                    sender_object: dex_info.s_object.fields.event_name,
                    image_object: dex_info.s_object.fields.image_url,
                    recipient: dex_info.recipient,
                })
            }
        }
        else{
            alert('Invalid Exchange ID');
        }
    }
    const handleInputDexId = (value: string) => {
        setInputDexId(value);
    }
    const handleBuyPassTicket = async () => {
        if (currAccount) {

            if (currDex) {
                const tx = new Transaction();
                tx.moveCall({
                    target: `${PACKAGE_ID}::atomic_swap::join_and_swap`,
                    arguments: [
                        tx.object(currDex?.id),
                        tx.object(tickId),
                    ]
                })
                sign_execute({
                    transaction: tx,
                    account: currAccount,
                    chain: 'sui:testnet',
                },
                    {
                        onSuccess: (result) => {
                            setExchangeResult({
                                txHash: result.digest,
                                balance: currDex.pass_price,
                                ticket_name: currDex.sender_object,
                            });
                        },
                        onError: (error) => { console.error('Error on buy pass ticket:', error); },
                    }
                )
            }
        }
    }
    return (
        <div className={`${cx('wrapper', 'gradient-bg')} bg-[#191970] min-h-screen  text-white font-sans`}>
            <div className={`${cx('header', 'gradient-bg')}  text-white py-6 px-4 shadow-lg`}>
                <div className={`${cx('container')} mx-auto flex justify-between items-center`}>
                    <h1 className={`${cx('title')} text-3xl font-bold flex items-center`}>
                        <i className="fas fa-coins mr-2"></i> NFT Exchange
                    </h1>
                    <div className={`${cx('actions')} flex items-center space-x-4`}>
                        <button
                            className={`${cx('connect-wallet')} bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100 transition`}>
                            {/* <i className="fas fa-wallet mr-2"></i> Connect Wallet */}
                            <ConnectButton />
                        </button>
                        <div className={`${cx('user-icon')} w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600`}>
                            <i className="fas fa-user"></i>
                        </div>
                    </div>
                </div>
            </div>

            <div className={`${cx('content-container')} container mx-auto px-4 py-8`}>
                <div className={`${cx('card')} max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 mb-8`}>
                    <h2 className={`${cx('card-title')} text-2xl font-bold text-gray-800 mb-6 flex items-center`}>
                        <i className="fas fa-search mr-2 text-purple-600"></i> Find NFT by ID
                    </h2>

                    <div className={`${cx('search-section')} flex flex-col md:flex-row gap-4 mb-6`}>
                        <div className={`${cx('search-input')} flex-1`}>
                            <label htmlFor="nftId" className={`${cx('label')} block text-sm font-medium text-gray-700 mb-1`}>NFT ID</label>
                            <div className="relative">
                                <input type="text" id="nftId" placeholder="Enter NFT ID (e.g. #12345)"
                                    className="text-gray-700 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    onChange={(e) => handleInputDexId(e.target.value)}
                                />
                                <button className="absolute right-2 top-2 text-gray-400 hover:text-purple-600">
                                    <i className="fas fa-qrcode"></i>
                                </button>
                            </div>
                        </div>
                        <div className="mt-auto">
                            <button id="searchBtn"
                                className={`${cx('gradient-bg')} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center`}
                                onClick={() => handleSearchDexId(inputDexId)}>
                                <i className="fas fa-search mr-2"></i> Search NFT
                            </button>
                        </div>
                    </div>
                    {currDex && (<>
                        <div id="nftInfo" className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <img id="nftImage" src={currDex.image_object} alt="NFT"
                                        className="w-48 h-48 rounded-lg object-cover shadow" />
                                </div>
                                <div className="flex-1">
                                    <h3 id="nftName" className="text-xl font-bold text-gray-800">{currDex.sender_object}</h3>
                                    <p id="nftCollection" className="text-purple-600 font-medium mb-2">workshop</p>
                                    <div className="flex items-center mb-4">
                                        <span id="nftPrice" className="text-gray-800 text-2xl font-bold mr-2">{Number(currDex.pass_price) / coin_unit} TICK</span>
                                        <span className="text-gray-500">≈ {Number(currDex.pass_price) / (10 * coin_unit) * 4} $</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <p className="text-sm text-gray-500">Owner</p>
                                            <a href={`https://suiscan.xyz/testnet/account/${currDex.sender}`} target="_blank" >
                                                <p id="nftOwner" className="text-gray-800 font-medium overflow-hidden text-ellipsis">
                                                    {currDex.sender}
                                                </p>
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Creator</p>
                                            <a href={`https://suiscan.xyz/testnet/account/${currDex.sender}`} target="_blank" >
                                                <p id="nftCreator" className="font-medium text-gray-800 overflow-hidden text-ellipsis">{currDex.sender}</p>
                                            </a>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Exchange Rate</p>
                                            <p id="exchangeRate" className="font-medium text-gray-800">1 TICK = 0.1 SUI</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-sm text-gray-500">
                                        <i className="fas fa-info-circle mr-1"></i>
                                        <span id="poolInfo">This NFT is part of a liquidity pool with 1% trading fee</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-2">
                            <button id="searchBtn"
                                className={`${cx('gradient-bg')} text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition flex items-center`}
                                onClick={handleBuyPassTicket}
                            >
                                <i className="fa-regular fa-money-bill-1 mr-2"></i>Buy NFT
                            </button>
                        </div>
                    </>)}
                </div>
            </div>
            {exchangeResult &&
                <div id="successModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <i className="fas fa-check-circle text-green-500 text-4xl"></i>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Exchange Successful!</h3>
                        <p id="successMessage" className="text-gray-600 mb-6">You have successfully exchanged {exchangeResult?.balance} TICK for 1 {exchangeResult?.ticket_name}</p>
                        <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-500">Transaction Hash:</span>
                                <span id="txHash" className="font-mono text-sm text-purple-600">{exchangeResult?.txHash}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-500">View on Explorer:</span>
                                <a href={`https://suiscan.xyz/testnet/tx/${exchangeResult?.txHash}`} target="_blank"
                                    className="text-purple-600 hover:underline text-sm">Suiscan <i
                                        className="fas fa-external-link-alt ml-1"></i></a>
                            </div>
                        </div>
                        <button id="closeModal"
                            className={`${cx('gradient-bg')} text-white px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition`}
                            onClick={() => setExchangeResult(null)}
                        >
                            Done
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default BuyTicket;