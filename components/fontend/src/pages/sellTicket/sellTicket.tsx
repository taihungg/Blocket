import styles from './sellTicket.module.scss';
import classNames from 'classnames/bind';
import { useState } from 'react';

const cx = classNames.bind(styles);
interface detailNFT {
    image_url: string,
    image_des: string,
    title: string,
    description: string,
    collection: string,
    owner: string,
    id: string,
    price: string
}
interface nftDisplay {
    id: string,
    name: string,
    description: string,
    imageurl: string,
    collection: string,
    owner: string,
    currentprice: string,
}
function SellTicket() {
    const nftdatabase = [
        {
            id: "12345",
            name: "cryptopunk #1234",
            description: "one of the original 10,000 cryptopunks. this one has a mohawk and small shades.",
            imageurl: "https://cryptopunks.app/cryptopunks/cryptopunk1234.png",
            collection: "cryptopunks",
            owner: "0x1a2b3c...d4e5f6",
            currentprice: "2.5 eth"
        },
        {
            id: "67890",
            name: "bored ape #5678",
            description: "a rare bored ape with gold fur and laser eyes from the famous collection.",
            imageurl: "https://i.seadn.io/gae/ju9ckwtv-1ok7f0wjttd93xqpj8rmd1rybqv8ceijy_q7uz0k9wzp7pyqe7o3rh7k3zq9y3x9z",
            collection: "bored ape yacht club",
            owner: "0x7b8c9d...e1f2g3",
            currentprice: "15.8 eth"
        },
        {
            id: "24680",
            name: "art blocks #1357",
            description: "generative art piece from the chromie squiggle collection.",
            imageurl: "https://artblocks.io/artblocks/chromie-squiggle-1357.png",
            collection: "art blocks",
            owner: "0x4e5f6g...h7i8j9",
            currentprice: "3.2 eth"
        },
        {
            id: "35791",
            name: "cryptopunk #2468",
            description: "zombie cryptopunk with wild hair and pipe.",
            imageurl: "https://cryptopunks.app/cryptopunks/cryptopunk2468.png",
            collection: "cryptopunks",
            owner: "0x1a2b3c...d4e5f6",
            currentprice: "4.1 eth"
        },
        {
            id: "46802",
            name: "bored ape #8024",
            description: "blue fur bored ape with cowboy hat.",
            imageurl: "https://i.seadn.io/gae/ju9ckwtv-1ok7f0wjttd93xqpj8rmd1rybqv8ceijy_q7uz0k9wzp7pyqe7o3rh7k3zq9y3x9z5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5q5极简版url",
            collection: "bored ape yacht club",
            owner: "0x7b8c9d...e1f2g3",
            currentprice: "12.3 eth"
        },
        {
            id: "57913",
            name: "digital art #001",
            description: "abstract digital art piece with vibrant colors.",
            imageurl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=m3wxmja3fdb8mhxwag90by1wywdlfhx8fgvufdb8fhx8fa%3d%3d&auto=format&fit=crop&w=1000&q=80",
            collection: "other",
            owner: "0x9k0l1m...n2o3p4",
            currentprice: "0.8 eth"
        }
    ];

    //states
    const [detailNFT, setDetailNFT] = useState<detailNFT>();
    const [displayMode, setDisplayMode] = useState(0); //0 -- selection | 1 -- detail

    //functions
    const handleShowDetail = (nft: nftDisplay) => {
        setDisplayMode(1);
        setDetailNFT({
            image_url: nft.imageurl,
            image_des: nft.name,
            title: nft.name,
            description: nft.description,
            collection: nft.collection,
            owner: nft.owner,
            id: nft.id,
            price: nft.currentprice
        })
        // const nftDetailsElement = document.getElementById('nftdetails');
        // nftDetailsElement?.classList.remove('hidden')
    }
    const handleListForSell = () => {
        if(displayMode === 1 && detailNFT){
            
        }
    }
    return (
        <div className={`${cx('sell-ticket-wrapper')} bg-gray-50 min-h-screen`}>
            <div className={`${cx('container')} mx-auto px-4 py-8 max-w-4xl`}>
                <div className={`${cx('card')} bg-white rounded-xl shadow-md p-6`}>
                    {/* <!-- header --> */}
                    <div className={`${cx('header')} flex justify-between items-center mb-6`}>
                        <div>
                            <h1 className={`${cx('title')} text-2xl font-bold text-gray-800`}>sell your nft</h1>
                            <p className={`${cx('subtitle')} text-gray-500 text-sm`}>select and list your nft for sale</p>
                        </div>
                        <a href="#" className={`${cx('close-button')} text-gray-500 hover:text-gray-700`}>
                            <i className="fas fa-times text-xl"></i>
                        </a>
                    </div>

                    {/* <!-- nft selection section --> */}
                    {displayMode === 0 &&
                        <div id="nftselection" className={`${cx('nft-selection')} mb-8`}>
                            <div className={`${cx('nft-header')} flex justify-between items-center mb-4`}>
                                <h2 className={`${cx('nft-title')} text-lg font-semibold text-gray-800`}>your nft collection</h2>
                                <div className="relative">
                                    <select id="collectionfilter" className={`${cx('dropdown')} px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}>
                                        <option value="all">all collections</option>
                                        <option value="cryptopunks">cryptopunks</option>
                                        <option value="bored ape yacht club">bored ape yacht club</option>
                                        <option value="art blocks">art blocks</option>
                                        <option value="other">other</option>
                                    </select>
                                </div>
                            </div>

                            <div id="nftgrid" className={`${cx('nft-grid')} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4`}>
                                {nftdatabase.map(nft => (
                                    <div
                                        key={nft.id}
                                        className={`${cx('nft-card')} bg-white rounded-xl p-4 cursor-pointer border border-gray-200 hover:border-gray-300`}
                                        onClick={() => handleShowDetail(nft)}
                                    >
                                        <div className="relative">
                                            <img src={nft.imageurl} alt={nft.name} className={`w-full h-40 object-cover rounded-lg mb-3`} />
                                            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                                                ${nft.collection}
                                            </div>
                                        </div>
                                        <h3 className="font-semibold text-gray-800 truncate">${nft.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">${nft.currentprice}</p>
                                    </div>
                                ))}
                            </div>

                            <div id="nonftsmessage" className={`${cx('no-nfts-message')} text-center py-12 hidden`}>
                                <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                                <p className="text-gray-500">you don't own any nfts yet.</p>
                                <p className="text-gray-400 text-sm mt-2">purchase nfts to list them for sale</p>
                            </div>
                        </div>
                    }
                    {/* <!-- loading indicator --> */}
                    <div id="loadingindicator" className={`${cx('loading-indicator')} text-center py-8 hidden`}>
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">loading your nfts...</p>
                    </div>

                    {/* <!-- nft details section (initially hidden) --> */}
                    {displayMode === 1 &&
                        <div id="nftdetails" className={`${cx('nft-details')}  fade-in`}>
                            <div className={`${cx('details-header')} border-b border-gray-200 pb-6 mb-6`}>
                                <h2 className={`${cx('details-title')} text-xl font-semibold text-gray-800 mb-4`}>nft title</h2>
                                <div className={`${cx('nft-card')} bg-gray-50 rounded-xl p-4 flex flex-col md:flex-row gap-4`}>
                                    <div className="w-full md:w-1/3">
                                        <img id="nftimage" src={detailNFT?.image_url} alt={detailNFT?.image_des} className="w-full h-48 object-cover rounded-lg" />
                                    </div>
                                    <div className="w-full md:w-2/3">
                                        <h3 id="nfttitle" className={`${cx('nft-title')} text-lg font-bold text-gray-800`}>{detailNFT?.title}</h3>
                                        <p id="nftdescription" className="text-gray-600 mt-2">{detailNFT?.description}</p>
                                        <div className="mt-4 grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-gray-500 text-sm">collection</p>
                                                <p id="nftcollection" className="font-medium">{detailNFT?.collection}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">owner</p>
                                                <p id="nftowner" className="font-medium">{detailNFT?.owner}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">token id</p>
                                                <p id="nftid" className="font-medium">{detailNFT?.id}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500 text-sm">current price</p>
                                                <p id="nftcurrentprice" className="font-medium">{detailNFT?.price}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- listing form --> */}
                            <form id="sellform">
                                <div className="mb-6">
                                    <h2 className={`${cx('form-title')} text-xl font-semibold text-gray-800 mb-4`}>listing details</h2>
                                    <div className="mb-4">
                                        <label htmlFor="listingprice" className="block text-gray-700 font-medium mb-2">{detailNFT?.price} (eth)</label>
                                        <div className="relative">
                                            <input type="number" id="listingprice" step="0.01" min="0.01"
                                                className={`${cx('price-input')} w-full px-4 py-2 pl-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 eth-input`} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="listingduration" className="block text-gray-700 font-medium mb-2">listing duration</label>
                                        <select id="listingduration"
                                            className={`${cx('duration-select')} w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500`}
                                            defaultValue="7"
                                        >
                                            <option value="1">1 day</option>
                                            <option value="3">3 days</option>
                                            <option value="7">7 days</option>
                                            <option value="14">14 days</option>
                                            <option value="30">30 days</option>
                                        </select>
                                    </div>
                                </div>

                                {/* <!-- action buttons --> */}
                                <div className="flex justify-end space-x-3">
                                    <button type="button" id="cancelbtn"
                                        className={`${cx('cancel-button')} px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-100`}
                                        onClick={() => {
                                            setDisplayMode(0)
                                            setDetailNFT(undefined);
                                        }}
                                    >
                                        back to collection
                                    </button>
                                    <button type="submit" id="listbtn"
                                        className={`${cx('list-button')} px-6 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700`}
                                        onClick={() => handleListForSell(detailNFT)}
                                        >
                                        list nft for sale
                                    </button>
                                </div>
                            </form>
                        </div>
                    }

                    {/* <!-- error message --> */}
                    <div id="errormessage" className={`${cx('error-message')} hidden text-center py-8 text-red-500`}>
                        <i className="fas fa-exclamation-circle text-2xl mb-2"></i>
                        <p id="errortext" className="font-medium"></p>
                        <button id="tryagainbtn"
                            className={`${cx('try-again-button')} mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200`}>
                            try again
                        </button>
                    </div>
                </div>
            </div>

            {/* <!-- success notification --> */}
            <div id="successtoast"
                className={`${cx('success-toast')} fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform translate-y-10 opacity-0 transition-all duration-300`}>
                <i className="fas fa-check-circle"></i>
                <span>nft listed successfully!</span>
            </div>
        </div>
    );
}

export default SellTicket;