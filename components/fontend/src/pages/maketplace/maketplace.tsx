import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import styles from './maketplace.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { PACKAGE_ID } from '../../App';
import { coin_unit } from '../swap/swap';
import { Transaction } from '@mysten/sui/transactions';

const cx = classNames.bind(styles);
interface dexInfoRespone {
    owner: string,
    dex_id: string
}
interface dexInfo {
    id: string,
    sender: string,
    sender_object: string,
    recipient: string,
    pass_price: string,
    image_object: string,
}
function MaketPlace() {
    //SUI
    const currAccount = useCurrentAccount();
    const client = useSuiClient();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();
    //States
    const [userDex, setUserDex] = useState<dexInfo[]>()

    //when file be mounted
    useEffect(() => {
        const fetchAllUserDexInfomation = async () => {
            if (currAccount) {
                const allUserDex: dexInfoRespone[] = await fetchAllUserDex(currAccount.address);
                console.log(allUserDex)
                if (allUserDex) {
                    const allUserDexInfomation: dexInfo[] = [];
                    for (const dex of allUserDex) {
                        const dex_infomation: dexInfo = await getDexInfo(dex.dex_id);
                        allUserDexInfomation.push(dex_infomation);
                    }
                    setUserDex(allUserDexInfomation);
                }
            }
        }
        fetchAllUserDexInfomation();
    }, [currAccount])
    // console.log(userDex)

    //get dex object infomation by id 
    async function getDexInfo(dex_id: string): Promise<dexInfo> {
        if (currAccount) {
            try {
                const dex_infomation = await client.getObject({
                    id: dex_id,
                    options: {
                        showType: true,
                        showContent: true
                    }
                });
                if (dex_infomation.data?.type === `${PACKAGE_ID}::atomic_swap::Atomic_swap`) {
                    const info = (dex_infomation.data?.content as any).fields;
                    if (info.sender === currAccount.address) {
                        console.log(info)
                        return {
                            id: info.id.id,
                            sender: info.sender,
                            recipient: info.recipient,
                            sender_object: info.s_object.fields.event_name,
                            pass_price: info.pass_price,
                            image_object: info.s_object.fields.image_url
                        };
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
        return {
            id: '',
            sender: '',
            sender_object: '',
            recipient: '',
            pass_price: '',
            image_object: '',
        };
    }

    //fetch all dex object-id user created
    async function fetchAllUserDex(owner: string): Promise<dexInfoRespone[]> {
        if (!currAccount) {
            return [];
        }
        try {
            const response = await axios.post('http://localhost:3000/v1/dex/get_all_user_dex', {
                owner,
            });
            if (response.status === 200) {
                return response.data;
            } else {
                console.log('error in server side');
                return [];
            }
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const createUserDex = (owner: string, dex_id: string) => {
        if (currAccount) {
            try {
                axios.post('http://localhost:3000/v1/dex/add_user_dex', {
                    owner,
                    dex_id
                }).then(respone => {
                    if (respone.status === 201) {
                        alert('create your Dex successfully');
                    }
                    else {
                        console.log('error in server side');
                    }
                }).catch(e => console.error(e))
            } catch (error) {
                console.error(error)
            }
        }
    }
    const deleteDexById = async (dex_id: string) => {
        try {
            const respone = await axios.post('http://localhost:3000/v1/dex/delete_user_dex', {
                dex_id,
            });
            if (respone.status !== 200) {
                alert('got error while delete your dex')
            }
        } catch (error) {
            alert('got error while delete your dex in server side')
        }

    }
    const handleCancelList = (dex_id: string,) => {
        if (currAccount) {
            const tx = new Transaction();
            tx.moveCall({
                target: `${PACKAGE_ID}::atomic_swap::return_to_owner`,
                arguments: [
                    tx.object(dex_id),
                ]
            });
            sign_execute({
                transaction: tx,
                account: currAccount,
                chain: 'sui:testnet'
            },
                {
                    onSuccess: async (result) => {
                        await deleteDexById(dex_id);
                        alert(`Your ticket has been cancelled, check hash: ${result.digest}`);
                        setUserDex(
                            prev => {
                                const new_state = prev?.filter(dex => dex.id !== dex_id);
                                return new_state;
                            }
                        )
                        console.log(result.digest)
                    },
                    onError: (err) => { console.error('handleExchange' + err) }
                }
            )
        }
        else {
            alert('connect wallet first!!')
        }
    }
    return (
        <div className={`${cx('marketplace-wrapper')} min-h-screen bg-gray-100`}>
            <header className={`${cx('marketplace-header', 'gradient-bg')} shadow-lg `}>
                <div className={`${cx("container")} mx-auto px-4 py-6`}>
                    <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-white"><Link to='/'>Dash board</Link></h1>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-coins text-2xl text-white"></i>
                            <h1 className="text-2xl font-bold text-white">NFT Marketplace</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {/* <button className={`${cx('button-primary')} bg-white text-purple-600 px-4 py-2 rounded-full font-semibold hover:bg-purple-50 transition`}> */}
                            <ConnectButton />
                            {/* </button> */}
                            <div className="relative group">
                                <button className={`${cx('button-secondary')} w-10 h-10 rounded-full bg-purple-700 flex items-center justify-center`}>
                                    <i className="fas fa-user text-white"></i>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 hidden group-hover:block z-50">
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">My Profile</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">My NFTs</a>
                                    <a href="#" className="block px-4 py-2 text-gray-800 hover:bg-purple-100">Settings</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className={`${cx("container")} mx-auto px-4 py-8`}>
                <div className="flex justify-between items-center mb-8">
                    <h2 className={`${cx('section-title')} text-3xl font-bold text-gray-800`}>Discover NFTs</h2>
                    <div className="flex space-x-4">
                        <button id="sellNFTBtn" className={`${cx('button-primary')} bg-purple-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-purple-700 transition`}>
                            <Link to='/sell_ticket'>
                                <i className="fas fa-plus mr-2"></i>Sell NFT
                            </Link>
                        </button>
                        <div className="relative">
                            <select className={`${cx('dropdown')} appearance-none bg-white border border-gray-300 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-purple-500`}>
                                <option>All Categories</option>
                                <option>Art</option>
                                <option>Collectibles</option>
                                <option>Music</option>
                                <option>Photography</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <i className="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {userDex?.length === 0 && 
                        <p>You haven't had any DEX yet</p>
                    }
                    {userDex && userDex.map(dex => (
                        <div className={`${cx('nft-card')} bg-white rounded-xl overflow-hidden shadow-md transition duration-300`}>
                            <div className="relative">
                                <img src={dex.image_object || "unknow_icon.png"} alt="NFT 3" className="w-full h-64 object-cover" />
                                <div className={`${cx('price-tag')} absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                    {Number(dex.pass_price) / coin_unit + ' TICK'}
                                </div>
                                <div className={`${cx('your-nft-tag')} absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                    {dex.sender_object}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className={`${cx('nft-title')} font-bold text-lg`}>{dex.sender_object}</h3>
                                        <p className="text-gray-500 text-sm">
                                            {
                                                dex.recipient.length > 30 ?
                                                    `${dex.recipient.slice(0, 20)}...${dex.recipient.slice(-10)}` :
                                                    dex.recipient
                                            }
                                        </p>
                                    </div>
                                    {/* <div className="flex items-center text-yellow-400">
                                        <i className="fas fa-star"></i>
                                        <span className="ml-1 text-gray-700">4.5</span>
                                    </div> */}
                                </div>
                                <div className="mt-4 flex justify-between items-center">
                                    <button className={`${cx('cancel-btn')} bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-red-600 transition`}
                                        onClick={() => handleCancelList(dex.id)}
                                    >
                                        Cancel Listing
                                    </button>
                                    <div className="flex space-x-2">
                                        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                            <i className="fas fa-heart text-gray-600"></i>
                                        </button>
                                        <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                            <i className="fas fa-share-alt text-gray-600"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                    {/* <div className={`${cx('nft-card')} bg-white rounded-xl overflow-hidden shadow-md transition duration-300`}>
                        <div className="relative">
                            <img src="https://ipfs.io/ipfs/QmXxS8q7nWZwZfZtoe9cYzXqQ3b7J7K5X1vJ7K5X1vJ7K5X1v/nft4.png" alt="NFT 4" className="w-full h-64 object-cover" />
                            <div className={`${cx('price-tag')} absolute top-2 right-2 bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-bold`}>
                                2.5 ETH
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className={`${cx('nft-title')} font-bold text-lg`}>Metaverse Land</h3>
                                    <p className="text-gray-500 text-sm">by @metaversecreator</p>
                                </div>
                                <div className="flex items-center text-yellow-400">
                                    <i className="fas fa-star"></i>
                                    <span className="ml-1 text-gray-700">4.7</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-between items-center">
                                <button className={`${cx('buy-btn')} bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-purple-700 transition`}>
                                    Buy Now
                                </button>
                                <div className="flex space-x-2">
                                    <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                        <i className="fas fa-heart text-gray-600"></i>
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300">
                                        <i className="fas fa-share-alt text-gray-600"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </main>

            <div id="sellModal" className="modal fixed inset-0 z-50 flex items-center justify-center hidden">
                <div className="blur-bg absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative bg-white rounded-xl w-full max-w-md mx-4 z-10">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">List Your NFT</h3>
                            <button id="closeSellModal" className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <form id="sellForm">
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nftImage">
                                    NFT Image
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                                        <p className="text-gray-500">Drag & drop your NFT image here</p>
                                        <p className="text-gray-400 text-sm mt-1">or</p>
                                        <button type="button" className="mt-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-gray-200">
                                            Browse Files
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nftName">
                                    NFT Name
                                </label>
                                <input type="text" id="nftName" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nftDescription">
                                    Description
                                </label>
                                <textarea id="nftDescription" rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="nftPrice">
                                    Price (ETH)
                                </label>
                                <input type="number" id="nftPrice" step="0.01" min="0.01" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                            </div>
                            <div className="flex justify-end space-x-3 mt-6">
                                <button type="button" id="cancelSell" className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100">
                                    Cancel
                                </button>
                                <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-700">
                                    List NFT
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <div id="buyModal" className="modal fixed inset-0 z-50 flex items-center justify-center hidden">
                <div className="blur-bg absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative bg-white rounded-xl w-full max-w-md mx-4 z-10">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Confirm Purchase</h3>
                            <button id="closeBuyModal" className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <img id="buyNftImage" src='unknow_icon.png' alt="NFT" className="w-16 h-16 object-cover rounded-lg" />
                                <div>
                                    <h4 id="buyNftName" className="font-bold"></h4>
                                    <p id="buyNftPrice" className="text-purple-600 font-semibold"></p>
                                </div>
                            </div>
                            <div className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span id="subtotal" className="font-semibold"></span>
                                </div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Service Fee (2.5%)</span>
                                    <span id="serviceFee" className="font-semibold"></span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-200">
                                    <span className="text-gray-800 font-bold">Total</span>
                                    <span id="totalPrice" className="text-purple-600 font-bold"></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" id="cancelBuy" className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100">
                                Cancel
                            </button>
                            <button type="button" id="confirmBuy" className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-purple-700">
                                Confirm Purchase
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="cancelModal" className="modal fixed inset-0 z-50 flex items-center justify-center hidden">
                <div className="blur-bg absolute inset-0 bg-black bg-opacity-50"></div>
                <div className="relative bg-white rounded-xl w-full max-w-md mx-4 z-10">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-gray-800">Cancel Listing</h3>
                            <button id="closeCancelModal" className="text-gray-500 hover:text-gray-700">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="mb-6">
                            <div className="flex items-center space-x-4 mb-4">
                                <img id="cancelNftImage" src="unknow_icon.png" alt="NFT" className="w-16 h-16 object-cover rounded-lg" />
                                <div>
                                    <h4 id="cancelNftName" className="font-bold"></h4>
                                    <p id="cancelNftPrice" className="text-purple-600 font-semibold"></p>
                                </div>
                            </div>
                            <p className="text-gray-700">Are you sure you want to cancel this listing? This will remove your NFT from the marketplace.</p>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button type="button" id="dontCancel" className="px-4 py-2 border border-gray-300 rounded-full text-sm font-semibold hover:bg-gray-100">
                                Don't Cancel
                            </button>
                            <button type="button" id="confirmCancel" className="bg-red-500 text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-red-600">
                                Confirm Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div id="successNotification" className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 transform translate-y-10 opacity-0 transition duration-300">
                <i className="fas fa-check-circle"></i>
                <span id="successMessage">Operation completed successfully!</span>
            </div>

            {/* <script>
        // DOM Elements
        const sellNFTBtn = document.getElementById('sellNFTBtn');
        const sellModal = document.getElementById('sellModal');
        const closeSellModal = document.getElementById('closeSellModal');
        const cancelSell = document.getElementById('cancelSell');
        const sellForm = document.getElementById('sellForm');
        
        const buyBtns = document.querySelectorAll('.buy-btn');
        const buyModal = document.getElementById('buyModal');
        const closeBuyModal = document.getElementById('closeBuyModal');
        const cancelBuy = document.getElementById('cancelBuy');
        const confirmBuy = document.getElementById('confirmBuy');
        
        const cancelBtns = document.querySelectorAll('.cancel-btn');
        const cancelModal = document.getElementById('cancelModal');
        const closeCancelModal = document.getElementById('closeCancelModal');
        const dontCancel = document.getElementById('dontCancel');
        const confirmCancel = document.getElementById('confirmCancel');
        
        const successNotification = document.getElementById('successNotification');
        const successMessage = document.getElementById('successMessage');
        
        // Connect Wallet Button
        document.getElementById('connectWallet').addEventListener('click', () => {
            showNotification('Wallet connected successfully!');
        });
        
        // Sell NFT Modal
        sellNFTBtn.addEventListener('click', () => {
            sellModal.classList.remove('hidden');
        });
        
        closeSellModal.addEventListener('click', () => {
            sellModal.classList.add('hidden');
        });
        
        cancelSell.addEventListener('click', () => {
            sellModal.classList.add('hidden');
        });
        
        sellForm.addEventListener('submit', (e) => {
            e.preventDefault();
            sellModal.classList.add('hidden');
            showNotification('Your NFT has been listed successfully!');
            // Here you would typically send the data to your backend
        });
        
        // Buy NFT Modal
        buyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const nftCard = btn.closest('.nft-card');
                const nftImage = nftCard.querySelector('img').src;
                const nftName = nftCard.querySelector('h3').textContent;
                const nftPrice = nftCard.querySelector('.bg-purple-600').textContent;
                
                document.getElementById('buyNftImage').src = nftImage;
                document.getElementById('buyNftName').textContent = nftName;
                document.getElementById('buyNftPrice').textContent = nftPrice;
                
                const price = parseFloat(nftPrice.split(' ')[0]);
                const serviceFee = price * 0.025;
                const total = price + serviceFee;
                
                document.getElementById('subtotal').textContent = `${price.toFixed(2)} ETH`;
                document.getElementById('serviceFee').textContent = `${serviceFee.toFixed(4)} ETH`;
                document.getElementById('totalPrice').textContent = `${total.toFixed(4)} ETH`;
                
                buyModal.classList.remove('hidden');
            });
        });
        
        closeBuyModal.addEventListener('click', () => {
            buyModal.classList.add('hidden');
        });
        
        cancelBuy.addEventListener('click', () => {
            buyModal.classList.add('hidden');
        });
        
        confirmBuy.addEventListener('click', () => {
            buyModal.classList.add('hidden');
            showNotification('NFT purchased successfully!');
            // Here you would typically process the payment and transfer ownership
        });
        
        // Cancel Listing Modal
        cancelBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const nftCard = btn.closest('.nft-card');
                const nftImage = nftCard.querySelector('img').src;
                const nftName = nftCard.querySelector('h3').textContent;
                const nftPrice = nftCard.querySelector('.bg-purple-600').textContent;
                
                document.getElementById('cancelNftImage').src = nftImage;
                document.getElementById('cancelNftName').textContent = nftName;
                document.getElementById('cancelNftPrice').textContent = nftPrice;
                
                cancelModal.classList.remove('hidden');
            });
        });
        
        closeCancelModal.addEventListener('click', () => {
            cancelModal.classList.add('hidden');
        });
        
        dontCancel.addEventListener('click', () => {
            cancelModal.classList.add('hidden');
        });
        
        confirmCancel.addEventListener('click', () => {
            cancelModal.classList.add('hidden');
            showNotification('NFT listing canceled successfully!');
            // Here you would typically remove the NFT from the marketplace
        });
        
        // Show notification
        function showNotification(message) {
            successMessage.textContent = message;
            successNotification.classList.remove('translate-y-10', 'opacity-0');
            successNotification.classList.add('translate-y-0', 'opacity-100');
            
            setTimeout(() => {
                successNotification.classList.remove('translate-y-0', 'opacity-100');
                successNotification.classList.add('translate-y-10', 'opacity-0');
            }, 3000);
        }
    </script> */}
        </div>
    );
}

export default MaketPlace;