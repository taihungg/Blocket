import { useState } from 'react';
import { Link } from 'react-router';
import axios from 'axios';
import { ConnectButton, useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import { coin_unit, PACKAGE_ID } from '../../App';

interface EventCreateForm {
    eventName: string;
    eventDescription: string;
    ticketPrice: number;
    maxTicket: number;
    eventHost: string;
    ticketImage: string;
}
function EventCreate() {
    //sui
    const currAccount = useCurrentAccount();
    const client = useSuiClient(); 
    //states
    const [formData, setFormData] = useState<EventCreateForm>({
        eventName: '',
        eventDescription: '',
        ticketPrice: 0,
        maxTicket: 0,
        eventHost: '',
        ticketImage: '',
    });
    const {mutate: sign_execute} = useSignAndExecuteTransaction();

    //functions

    const query = async (digest: string, retries = 5, delay = 2000) => {
        for (let i = 0; i < retries; i++) {
            try {
                console.log(`Attempt ${i + 1} to query transaction with digest: ${digest}`);
                const response = await client.getTransactionBlock({
                    digest: digest,
                    options: {
                        showEffects: true,
                        showObjectChanges: true,
                    },
                });

                if (response) {
                    console.log('Transaction Block Response:', response);
                    if (response.effects?.created?.[0]) {
                        const createdObjectId = response.effects.created[0].reference.objectId;
                        alert(
                            `Your event has ID: ${createdObjectId}`
                        );
                        await axios.post('https://blocketserver.vercel.app/v1/event/create_event', {
                            event_id: createdObjectId
                        })
                    } else {
                        console.log('No created objects found.');
                        alert('No created objects found.');
                    }
                    return; // Thoát nếu thành công
                }
            } catch (error) {
                console.error(`Error querying transaction (attempt ${i + 1}):`, error);
                if (i === retries - 1) {
                    alert('Failed to query transaction after multiple attempts. Please check the digest manually.');
                    return;
                }
                // Đợi trước khi thử lại
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    };
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const handleCreateEvent = () => {
        if(!parseInt(formData.eventHost) && formData.eventHost.length !== 66) {
            alert('Invalid event host address');
            return;
        }
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(10000000); // Tăng gas budget để tránh lỗi InsufficientGas
            tx.moveCall({
                target: `${PACKAGE_ID}::workshop::create`,
                arguments: [
                    tx.pure.address(formData.eventHost),
                    tx.pure.u64(formData.ticketPrice * coin_unit),
                    tx.pure.u64(formData.maxTicket),
                    tx.pure.string(formData.eventName),
                    tx.pure.string(formData.eventDescription),
                    tx.pure.string(formData.ticketImage),
                ],
            });

            sign_execute(
                {
                    transaction: tx,
                    account: currAccount,
                    chain: 'sui:testnet',
                },
                {
                    onSuccess: async (res) => {
                        // alert(`Transaction successful with digest: ${res.digest}`);
                        // setDigest(res.digest); // Lưu digest nếu cần
                        // Gọi query với cơ chế retry
                        await query(res.digest);
                    },
                    onError: (e) => {
                        console.error('Transaction Error:', e);
                        alert('Transaction failed');
                    },
                }
            );
        } else {
            alert('Please connect an account');
        }

    }
    return (
        <div className='bg-[#f3f4f6] h-screen flex items-center flex-col'>
            <div className='mt-2 w-4/5 flex justify-between bg-cover bg-center h-16 mb-4'>
                <div className='flex'
                    style={{ backgroundImage: 'url(/images/bg.jpg)' }}
                >
                    <i className="fas fa-home text-2xl ml-3 mr-3"></i>
                    <Link to='/'>
                        <h1 className='text-black text-2xl font-bold cursor-pointer'>Dash Board</h1>
                    </Link>
                </div>
                <ConnectButton />
            </div>
            <div className='border-2 border-gray-300 bg-white rounded-lg shadow-lg p-8 w-2/3 max-w-[500px]'>
                <h2 className='text-2xl font-bold mb-6 text-center'>Create Event</h2>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Event Name</label>
                    <input type="text" className='border border-gray-300 rounded-lg p-2 w-full'
                        onChange={handleChange}
                        name='eventName'
                        placeholder='Event Name'
                        value={formData.eventName}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Event Description</label>
                    <textarea className='border border-gray-300 rounded-lg p-2 w-full' rows={4}
                        onChange={handleChange}
                        name='eventDescription'
                        placeholder='Event Description'
                        value={formData.eventDescription}
                        required
                    ></textarea>
                </div>

                <div className="mb-4 flex justify-between">
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2'>Ticket Prices (TICK)</label>
                        <input type="number" className='border border-gray-300 rounded-lg p-2 w-full'
                            placeholder='number of TICK'
                            onChange={handleChange}
                            name='ticketPrice'
                            value={formData.ticketPrice}
                            required
                            min={0}
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium mb-2'>Max Ticket (TICK)</label>
                        <input type="number" className='border border-gray-300 rounded-lg p-2 w-full'
                            placeholder='10'
                            onChange={handleChange}
                            name='maxTicket'
                            value={formData.maxTicket}
                            required
                            min={0}
                        />
                    </div>
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Event Host</label>
                    <input type="text" className='border border-gray-300 rounded-lg p-2 w-full'
                        placeholder='0xabc1234567890abcdef1234567890abcdef1234'
                        onChange={handleChange}
                        name='eventHost'
                        value={formData.eventHost}
                        required
                    />
                </div>
                <div className='mb-4'>
                    <label className='block text-sm font-medium mb-2'>Ticket Image</label>
                    <input type="text" className='border border-gray-300 rounded-lg p-2 w-full'
                        placeholder='https://example.com/ticket-image.png'
                        onChange={handleChange}
                        name='ticketImage'
                        value={formData.ticketImage}
                        required
                    />
                </div>
                <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-lg w-full hover:bg-blue-600 transition duration-200'
                    onClick={() => {
                        handleCreateEvent();
                    }}
                >
                    Create Event
                </button>
            </div>
        </div>
    );
}

export default EventCreate;