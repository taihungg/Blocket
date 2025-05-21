import { useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import styles from './collection.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { PACKAGE_ID, coin_unit } from '../../App';
import { Link } from 'react-router';


const cx = classNames.bind(styles);
// const IMAGE_DEFAULT = "https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozLSedaox1Y2nH0yx0FExO1rYw?auto=format&w=512";
const IMAGE_DEFAULT = 'blocket_logo.jpg'
interface TickTokenInfo {
    id: string,
    balance: string,
}
export interface TicketInfo {
    id: string,
    event_id: string,
    event_name: string,
    description: string,
    image_url: string,
}

function Collection() {
    //sui variables
    const client = useSuiClient();
    const currAccount = useCurrentAccount();

    //State for items UI
    const [tickTokenInfomation, setTickTokenInfomation] = useState<TickTokenInfo[]>([]);
    const [ticketInfomation, setTicketInfomation] = useState<TicketInfo[]>([])
    const [userAssets, setUserAssets] = useState<(TickTokenInfo | TicketInfo)[]>([])

    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('all');

    // State for NFT modal
    const [selectedNFT, setSelectedNFT] = useState<{
        id: string,
        name: string
        image_url: string
    } | null>(null);

    useEffect(() => {
        if (currAccount) {
            const getAllUserItems = async () => {
                //array                
                let tokens_taken: TickTokenInfo[] = [];
                let tickets_taken: TicketInfo[] = [];

                //getToken
                const tick_tokens = await client.getOwnedObjects({
                    owner: currAccount.address,
                    filter: {
                        StructType: `0x2::coin::Coin<${PACKAGE_ID}::tick::TICK>`
                    },
                    options: {
                        showType: true,
                        showContent: true,
                    }
                });
                tick_tokens.data.map(tick_token => {
                    const tokenInfo = (tick_token.data?.content as any).fields
                    const new_token: TickTokenInfo = {
                        id: (tokenInfo.id as any).id,
                        balance: tokenInfo.balance
                    }
                    tokens_taken.push(new_token);
                })

                //getTickets
                const tickets = await client.getOwnedObjects({
                    owner: currAccount.address,
                    filter: {
                        StructType: `${PACKAGE_ID}::workshop::Ticket`
                    },
                    options: {
                        showType: true,
                        showContent: true,
                    }
                });
                tickets.data.map(ticket => {
                    const ticketInfo = (ticket.data?.content as any).fields;
                    const new_ticket: TicketInfo = {
                        id: ticketInfo.id.id,
                        event_id: ticketInfo.event_id,
                        event_name: ticketInfo.event_name,
                        description: ticketInfo.description,
                        image_url: ticketInfo.image_url,
                    }
                    tickets_taken.push(new_ticket);
                })

                //setState
                setTickTokenInfomation(tokens_taken);
                setTicketInfomation(tickets_taken);
                setUserAssets([
                    ...tokens_taken,
                    ...tickets_taken
                ])
            }
            getAllUserItems();
        }
    }, [currAccount])

    // console.log(
    //     userAssets
    // )

    // Handle NFT card click
    const handleNFTClick = (nft: { id: string, name: string, image_url: string }) => {
        setSelectedNFT(nft);
        // You can add modal logic here
    };

    // Handle tab switching
    const handleTabClick = (tabName: string) => {
        setActiveTab(tabName);
    };

    // Handle Add NFT button click
    const handleAddNFT = () => {
        // Add NFT logic here
        console.log('Add NFT clicked');
    };

    // Handle Transfer button click
    const handleTransfer = (id?: string) => {
        // Transfer NFT logic here
        if (id) {
            console.log('Transfer clicked for id:', id);
        } else {
            console.log('Transfer clicked');
        }
    };

    // Handle like/favorite
    const handleLike = (nftId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent triggering card click
        // Like/favorite logic here
        console.log('Liked NFT:', nftId);
    };

    const handleGetQRCode = (address: string, item_id: string) => {
        if (address === '') {
            alert('connect wallet first!');
        }
        else {

        }
    }

    return (
        <div className={`${cx('wrapper')} bg-[#191970] min-h-screen gradient-bg text-white font-sans`}>
            <div className={`${cx('container')} mx-auto px-4 py-8`}>
                {/* Header */}
                <div className={`${cx('header-left')} flex items-center`}>
                    <h1 className={`${cx('title')} text-2xl font-bold`}><Link to='/'>Dash board</Link></h1>
                </div>
                <div className={`${cx('header')} flex justify-between items-center mb-8`}>
                    <div className={`${cx('header-left')} flex items-center`}>
                        <i className={`${cx('wallet-icon')} fas fa-wallet text-2xl mr-2 text-purple-500`}></i>
                        <h1 className={`${cx('title')} text-2xl font-bold`}>NFT Wallet</h1>
                    </div>
                    <div className={`${cx('header-right')} flex items-center space-x-4`}>
                        <div className={`${cx('wallet-info')} flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2`}>
                            <div className={`${cx('status-dot')} w-3 h-3 rounded-full bg-green-500 mr-2`}></div>
                            <span className={`${cx('address')} text-sm`}>
                                {currAccount?.address && currAccount.address.length >= 9
                                    ? `${currAccount.address.slice(0, 6)}...${currAccount.address.slice(-3)}`
                                    : currAccount?.address}
                            </span>
                        </div>
                        <button className={`${cx('user-button')} w-10 h-10 rounded-full bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center`}>
                            <i className={`${cx('user-icon')} fas fa-user`}></i>
                        </button>
                    </div>
                </div>

                {/* Wallet Overview */}
                <div className={`${cx('wallet-overview')} bg-white bg-opacity-5 rounded-2xl p-6 mb-8`}>
                    <div className={`${cx('overview-content')} flex flex-col md:flex-row justify-between items-start md:items-center`}>
                        <div className={`${cx('overview-header')} mb-4 md:mb-0`}>
                            <h2 className={`${cx('overview-title')} text-xl font-semibold mb-2`}>Your Collection</h2>
                            <p className={`${cx('overview-description')} text-gray-300`}>Manage and view your digital assets</p>
                        </div>
                        <div className={`${cx('overview-actions')} flex space-x-3`}>
                            <Link to='/swap'>
                                <button
                                    className={`${cx('add-button')} px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center`}
                                    onClick={handleAddNFT}
                                >
                                    <i className="fas fa-plus mr-2"></i> Buy TICK token
                                </button>

                            </Link>
                            <Link to='/sell_ticket'>
                                <button
                                    className={`${cx('transfer-button')} px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center`}
                                    onClick={() => handleTransfer()}
                                >
                                    <i className="fas fa-exchange-alt mr-2"></i> Transfer
                                </button>
                            </Link>
                        </div>
                    </div>

                    <div className={`${cx('stats-grid')} grid grid-cols-1 md:grid-cols-3 gap-6 mt-6`}>
                        <div className={`${cx('stat-card')} bg-white bg-opacity-5 rounded-xl p-4`}>
                            <div className={`${cx('stat-header')} flex items-center mb-2`}>
                                <i className="fas fa-layer-group text-purple-500 mr-2"></i>
                                <span className="text-gray-300">Total NFTs</span>
                            </div>
                            <div className={`${cx('stat-value')} text-2xl font-bold`}>42</div>
                        </div>
                        <div className={`${cx('stat-card')} bg-white bg-opacity-5 rounded-xl p-4`}>
                            <div className={`${cx('stat-header')} flex items-center mb-2`}>
                                <i className="fas fa-coins text-yellow-500 mr-2"></i>
                                <span className="text-gray-300">Collections</span>
                            </div>
                            <div className={`${cx('stat-value')} text-2xl font-bold`}>8</div>
                        </div>
                        <div className={`${cx('stat-card')} bg-white bg-opacity-5 rounded-xl p-4`}>
                            <div className={`${cx('stat-header')} flex items-center mb-2`}>
                                <i className="fas fa-fire text-red-500 mr-2"></i>
                                <span className="text-gray-300">Floor Value</span>
                            </div>
                            <div className={`${cx('stat-value')} text-2xl font-bold`}>0.1 SUI</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`${cx('tabs')} flex border-b border-white border-opacity-10 mb-6`}>
                    <button
                        className={`${cx('tab')} px-4 py-2 font-medium ${activeTab === 'all' ? 'text-white border-b-2 border-purple-600' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => handleTabClick('all')}
                    >
                        All NFTs
                    </button>
                    <button
                        className={`${cx('tab')} px-4 py-2 font-medium ${activeTab === 'collections' ? 'text-white border-b-2 border-purple-600' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => handleTabClick('collections')}
                    >
                        Collections
                    </button>
                    <button className={`${cx('tab')} px-4 py-2 font-medium text-gray-400 hover:text-white`}>Favorites</button>
                    <button className={`${cx('tab')} px-4 py-2 font-medium text-gray-400 hover:text-white`}>Hidden</button>
                </div>

                {/* NFT Grid */}
                <div className={`${cx('nft-grid')} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
                    {
                        userAssets.map(item => (
                            <div
                                className={`${cx('nft-card')} bg-white bg-opacity-5 rounded-xl overflow-hidden cursor-pointer`}
                                onClick={() => handleNFTClick({
                                    id: item.id,
                                    name: 'event_name' in item ? item.event_name : 'tick',
                                    image_url: 'image_url' in item ? item.image_url : IMAGE_DEFAULT
                                })}
                            >
                                <div className={`${cx('image-container')} relative`}>
                                    <img
                                        src={'image_url' in item ? item.image_url : IMAGE_DEFAULT}
                                        alt="item-image"
                                        className={`${cx('nft-image')} w-full h-64 object-cover`}
                                    />
                                    <div className={`${cx('like-button')} absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1`}
                                        onClick={(e) => handleLike('Cool Cat #1234', e)}>
                                        <i className={`${cx('heart-icon')} far fa-heart text-white`}></i>
                                    </div>
                                </div>
                                <div className={`${cx('card-content')} p-4`}>
                                    <div className={`${cx('content-header')} flex justify-between items-start mb-1`}>
                                        <h3 className={`${cx('nft-title')} font-medium truncate`}>{'event_name' in item ? item.event_name : 'Token TICK'}</h3>
                                        <span className={`${cx('price')} text-sm bg-purple-600 px-2 py-1 rounded-md`}>
                                            {'ticket_price' in item
                                                ? String((item as any).ticket_price / coin_unit)
                                                : 'balance' in item
                                                    ? String(Number((item as any).balance) / coin_unit) + ' TICK'
                                                    : 'unknow'}
                                        </span>
                                    </div>
                                    <p className={`${cx('collection-name')} text-gray-400 text-sm`}>Cool Cats</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>

            {/* Add modal for NFT details (optional) */}
            {selectedNFT && (
                <div className={cx('modal')}>
                    {/* Add modal content here */}
                    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                        {/* Background backdrop, show/hide based on modal state.

                        Entering: "ease-out duration-300"
                        From: "opacity-0"
                        To: "opacity-100"
                        Leaving: "ease-in duration-200"
                        From: "opacity-100"
                        To: "opacity-0" */}
                        <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true"></div>

                        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                                {/* Modal panel, show/hide based on modal state.

                                Entering: "ease-out duration-300"
                                From: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                To: "opacity-100 translate-y-0 sm:scale-100"
                                Leaving: "ease-in duration-200"
                                From: "opacity-100 translate-y-0 sm:scale-100"
                                To: "opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95" */}
                                <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                        <img src={selectedNFT.image_url} alt="QR-code" />
                                        <div className="mt-2">
                                            <h3 className="text-base font-semibold text-gray-900 truncate" id="modal-title">
                                                <a href={`https://suiscan.xyz/testnet/object/${selectedNFT.id}`} target='blank'>
                                                    {selectedNFT.id}
                                                </a>
                                            </h3>
                                            <p className="text-sm text-gray-500">That is QR code - be careful when share to anyone</p>
                                            <p className="text-sm text-gray-700">You can re-generate it to keep it safe</p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button type="button" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            // onClick={() => handleTransfer(selectedNFT.id)}
                                        >
                                            <Link to='/sell_ticket'>Transfer</Link>
                                        </button>
                                        <button type="button" className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={() => handleGetQRCode(currAccount?.address || '', selectedNFT.id)}
                                        >
                                            Get QR
                                        </button>
                                        <button type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => setSelectedNFT(null)}
                                        >Cancel</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Collection;