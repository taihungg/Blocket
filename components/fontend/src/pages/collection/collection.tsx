import { ConnectButton, useCurrentAccount, useSuiClient } from '@mysten/dapp-kit';
import styles from './collection.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { PACKAGE_ID } from '../../App';


const cx = classNames.bind(styles);
interface TickTokenInfo {
    id: string,
    balance: string,
}
interface TicketInfo {
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
    const [userAssets, setUserAssets] = useState<(TickTokenInfo | TicketInfo)[]>(
        [
            ...tickTokenInfomation,
            ...ticketInfomation
        ]
    )

    // State for active tab
    const [activeTab, setActiveTab] = useState<string>('all');

    // State for NFT modal
    const [selectedNFT, setSelectedNFT] = useState<{
        title: string;
        image: string;
        price: string;
        collection: string;
    } | null>(null);

    useEffect(() => {
        if (currAccount) {
            const getAllUserItems = async () => {
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
                    setTickTokenInfomation(prev =>
                        [
                            ...prev,
                            {
                                id: (tokenInfo.id as any).id,
                                balance: tokenInfo.balance
                            }
                        ]
                    )
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
                    setTicketInfomation(prev => [
                        ...prev,
                        {
                            id: ticketInfo.id.id,
                            event_id: ticketInfo.event_id,
                            event_name: ticketInfo.event_name,
                            description: ticketInfo.description,
                            image_url: ticketInfo.image_url,
                        }
                    ])
                })
            }
            getAllUserItems();
        }
    }, [currAccount])

    // console.log(
    //     tickTokenInfomation,
    //     ticketInfomation
    // )

    // Handle NFT card click
    const handleNFTClick = (nft: { title: string; image: string; price: string; collection: string }) => {
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
    const handleTransfer = () => {
        // Transfer NFT logic here
        console.log('Transfer clicked');
    };

    // Handle like/favorite
    const handleLike = (nftId: string, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent triggering card click
        // Like/favorite logic here
        console.log('Liked NFT:', nftId);
    };

    return (
        <div className={`${cx('wrapper')} bg-[#191970] min-h-screen gradient-bg text-white font-sans`}>
            <div className={`${cx('container')} mx-auto px-4 py-8`}>
                {/* Header */}
                <div className={`${cx('header')} flex justify-between items-center mb-8`}>
                    <div className={`${cx('header-left')} flex items-center`}>
                        <i className={`${cx('wallet-icon')} fas fa-wallet text-2xl mr-2 text-purple-500`}></i>
                        <h1 className={`${cx('title')} text-2xl font-bold`}>NFT Wallet</h1>
                    </div>
                    <div className={`${cx('header-right')} flex items-center space-x-4`}>
                        <div className={`${cx('wallet-info')} flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2`}>
                            <div className={`${cx('status-dot')} w-3 h-3 rounded-full bg-green-500 mr-2`}></div>
                            <span className={`${cx('address')} text-sm`}>
                                {currAccount?.address.slice(0, 6)}...{currAccount?.address.slice(-3,)}
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
                            <h2 className={`${cx('overview-title')} text-xl font-semibold mb-2`}>Your NFT Collection</h2>
                            <p className={`${cx('overview-description')} text-gray-300`}>Manage and view your digital assets</p>
                        </div>
                        <div className={`${cx('overview-actions')} flex space-x-3`}>
                            <button
                                className={`${cx('add-button')} px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 flex items-center`}
                                onClick={handleAddNFT}
                            >
                                <i className="fas fa-plus mr-2"></i> Add NFT
                            </button>
                            <button
                                className={`${cx('transfer-button')} px-4 py-2 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center`}
                                onClick={handleTransfer}
                            >
                                <i className="fas fa-exchange-alt mr-2"></i> Transfer
                            </button>
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
                            <div className={`${cx('stat-value')} text-2xl font-bold`}>3.42 ETH</div>
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
                    <div
                        className={`${cx('nft-card')} bg-white bg-opacity-5 rounded-xl overflow-hidden cursor-pointer`}
                        onClick={() => handleNFTClick({
                            title: 'Cool Cat #1234',
                            image: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozLSedaox1Y2nH0yx0FExO1rYw?auto=format&w=512',
                            price: '2.5 ETH',
                            collection: 'Cool Cats'
                        })}
                    >
                        <div className={`${cx('image-container')} relative`}>
                            <img
                                src="https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozLSedaox1Y2nH0yx0FExO1rYw?auto=format&w=512"
                                alt="NFT"
                                className={`${cx('nft-image')} w-full h-64 object-cover`}
                            />
                            <div className={`${cx('like-button')} absolute top-2 right-2 bg-black bg-opacity-70 rounded-full p-1`}
                                onClick={(e) => handleLike('Cool Cat #1234', e)}>
                                <i className={`${cx('heart-icon')} far fa-heart text-white`}></i>
                            </div>
                        </div>
                        {
                            
                        }
                        <div className={`${cx('card-content')} p-4`}>
                            <div className={`${cx('content-header')} flex justify-between items-start mb-1`}>
                                <h3 className={`${cx('nft-title')} font-medium truncate`}>Cool Cat #1234</h3>
                                <span className={`${cx('price')} text-sm bg-purple-600 px-2 py-1 rounded-md`}>2.5 ETH</span>
                            </div>
                            <p className={`${cx('collection-name')} text-gray-400 text-sm`}>Cool Cats</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Add modal for NFT details (optional) */}
            {selectedNFT && (
                <div className={cx('modal')}>
                    {/* Add modal content here */}
                </div>
            )}
        </div>
    );
}

export default Collection;