import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import HeaderLayout from '../../layout/header.layout';
import styles from './create.module.scss';
import classNames from 'classnames/bind';
import { Transaction } from '@mysten/sui/transactions';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench } from '@fortawesome/free-solid-svg-icons';
import { coin_unit } from '../swap/swap';

const cx = classNames.bind(styles);

function CreateEvent() {
    const currAccount = useCurrentAccount();
    const { mutate: sae } = useSignAndExecuteTransaction();
    const [packageId, setPackageId] = useState('');
    const client = useSuiClient();
    const [digest, setDigest] = useState('');


    const [host, setHost] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [maxTickets, setMaxTickets] = useState(0);
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [imageUrl, setImageUrl] = useState('');

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
                        // await axios.post('http://localhost:3000/v1/event/create_event', {
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

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('https://blocketserver.vercel.app/get_package_id');
                // const res = await axios.get('http://localhost:3000/get_package_id');
                setPackageId(res.data.package_id);
            } catch (e) {
                console.error('Error fetching package ID:', e);
            }
        };
        fetch();
    }, []); // Chỉ gọi fetch packageId khi component mount

    // const create_event = () => {
    //     if (currAccount) {
    //         const tx = new Transaction();
    //         tx.setGasBudget(10000000); // Tăng gas budget để tránh lỗi InsufficientGas
    //         tx.moveCall({
    //             target: `${packageId}::workshop::create`,
    //             arguments: [
    //                 tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'),
    //                 tx.pure.u64(3),
    //                 tx.pure.u64(10),
    //                 tx.pure.string('Sui Viet Nam bootcamp'),
    //                 tx.pure.string('Sui make your day'),
    //                 tx.pure.string(''),
    //             ],
    //         });

    //         sae(
    //             {
    //                 transaction: tx,
    //                 account: currAccount,
    //                 chain: 'sui:testnet',
    //             },
    //             {
    //                 onSuccess: async (res) => {
    //                     console.log('Transaction Digest:', res.digest);
    //                     setDigest(res.digest); // Lưu digest nếu cần
    //                     // Gọi query với cơ chế retry
    //                     await query(res.digest);
    //                 },
    //                 onError: (e) => {
    //                     console.error('Transaction Error:', e);
    //                     alert('Transaction failed');
    //                 },
    //             }
    //         );
    //     } else {
    //         alert('Please connect an account');
    //     }
    // };

    // const Input = ({ title, state, onchange_callback }: { title: string; state: number | string, onchange_callback: (value: string) => void }) => {
    //     return (
    //         <div className={cx('infomations')}>
    //             <label htmlFor="info"
    //                 className={cx('label')}
    //             >{title}</label>

    //             <input
    //                 type="text"
    //                 name="info"
    //                 className={cx('input-info')}
    //                 onChange={e => onchange_callback(e.target.value)}
    //                 value={state.toString()}
    //                 placeholder={title === 'Host' ? '0xabc' : ''}
    //             />
    //         </div>
    //     );
    // };

    // const InputForm = [
    //     {
    //         name: 'Host',
    //         state: host,
    //         callbackFunction: setHost,
    //     },
    //     {
    //         name: 'Ticket Price',
    //         state: ticketPrice,
    //         callbackFunction: (value: string) => setTicketPrice(Number(value)),
    //     },
    //     {
    //         name: 'Max Tickets',
    //         state: maxTickets,
    //         callbackFunction: (value: string) => setMaxTickets(Number(value)),
    //     },
    //     {
    //         name: 'Event Name',
    //         state: eventName,
    //         callbackFunction: setEventName,
    //     },
    //     {
    //         name: 'Description',
    //         state: description,
    //         callbackFunction: setDescription,
    //     },
    //     {
    //         name: 'Image URL',
    //         state: imageUrl,
    //         callbackFunction: setImageUrl,
    //     },
    // ];
    const handleSubmit = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(10000000); // Tăng gas budget để tránh lỗi InsufficientGas
            tx.moveCall({
                target: `${packageId}::workshop::create`,
                arguments: [
                    tx.pure.address(host),
                    tx.pure.u64(ticketPrice*coin_unit),
                    tx.pure.u64(maxTickets),
                    tx.pure.string(eventName),
                    tx.pure.string(description),
                    tx.pure.string(imageUrl),
                ],
            });

            sae(
                {
                    transaction: tx,
                    account: currAccount,
                    chain: 'sui:testnet',
                },
                {
                    onSuccess: async (res) => {
                        console.log('Transaction Digest:', res.digest);
                        setDigest(res.digest); // Lưu digest nếu cần
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
        <HeaderLayout>
            <div className={cx('wrapper')}>
                <div className={cx('create-event')}>
                    <div className={cx('container')}>
                        {/* {InputForm.map((Type, index) => (
                            <Input
                                key={index}
                                title={Type.name}
                                state={Type.state}
                                onchange_callback={Type.callbackFunction}
                            />
                        ))} */}

                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Host</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setHost(e.target.value)}
                                value={host}
                                placeholder='0xabc'
                            />
                        </div>

                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Ticket Prices</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setTicketPrice(Number(e.target.value))}
                                value={ticketPrice}
                            />
                        </div>

                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Max Tickets</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setMaxTickets(Number(e.target.value))}
                                value={maxTickets}
                            />
                        </div>

                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Event Name</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setEventName(e.target.value)}
                                value={eventName}
                            />
                        </div>


                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Description</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setDescription(e.target.value)}
                                value={description}
                            />
                        </div>

                        <div className={cx('infomations')}>
                            <label htmlFor="info"
                                className={cx('label')}
                            >Image Url</label>

                            <input
                                type="text"
                                name="info"
                                className={cx('input-info')}
                                onChange={e => setImageUrl(e.target.value)}
                                value={imageUrl}
                            />
                        </div>
                    </div>
                    <div className={cx('triggers')}>
                        <h3>Event Policy</h3>
                        <p>Event will be public with tranparency infomation about host, price, logo, label, ...</p>
                        <div className={cx('buttons')}>
                            <button onClick={handleSubmit}>Create Event</button>
                            <div className={cx('configure')}>
                                <p>Config event with settings and will following our policy</p>
                                <div className={cx('config-button')}>
                                    <FontAwesomeIcon icon={faWrench} />
                                    <p>Config</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={cx('footer')}>

                </div>
            </div>
        </HeaderLayout>
    );
}

export default CreateEvent;