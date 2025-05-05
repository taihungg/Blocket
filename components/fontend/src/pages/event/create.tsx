// import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
// import HeaderLayout from '../../layout/header.layout';
// import styles from './create.module.scss';
// import classNames from 'classnames/bind';
// import { Transaction } from '@mysten/sui/transactions';
// import { useEffect, useState } from 'react';
// import axios from 'axios';
// import { createStaticHandler } from 'react-router';

// const cx = classNames.bind(styles);
// function CreateEvent() {
//     const currAccount = useCurrentAccount();
//     const { mutate: sae } = useSignAndExecuteTransaction();
//     const [packageId, setPackageId] = useState('');
//     const client = useSuiClient();
//     const [digest, setDigest] = useState('');

//     const query = async (digest: string) => {
//         const respone = await client.getTransactionBlock(
//             {
//                 digest: digest,
//                 options: {
//                     showEffects: true,
//                     showObjectChanges: true,
//                 }
//             }
//         )
//         if (respone) {
//             if (respone.effects?.created?.[0]) {
//                 alert(
//                     'Your event has id is ' +
//                     respone.effects.created[0].reference.objectId);
//             } else {
//                 console.log('No created objects found.');
//             }

//         }
//     }
//     useEffect(() => {
//         const fectch = async () => {
//             await axios.get('http://localhost:3000/get_package_id').then(res => {
//                 setPackageId(res.data.package_id);
//             }).catch(e => console.log(e))
//         }
//         query(digest);
//         fectch();
//     }, [digest])
//     const create_event = () => {
//         if (currAccount) {
//             const tx = new Transaction();
//             tx.setGasBudget(3000000);
//             tx.moveCall({
//                 target: `${packageId}::workshop::create`,
//                 arguments: [
//                     tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'),
//                     tx.pure.u64(3),
//                     tx.pure.u64(64),
//                     tx.pure.string('hello'),
//                     tx.pure.string('Event make your day'),
//                     tx.pure.string(''),
//                 ]
//             })
//             sae({
//                 transaction: tx,
//                 account: currAccount ? currAccount : undefined,
//                 chain: 'sui:testnet',
//             },
//                 {
//                     onSuccess: async (res) => {
//                         console.log(res.digest)
//                         setDigest(res.digest)
//                     },
//                     onError: (e) => { console.log(e) },
//                 })
//         }
//     }
//     return (
//         <HeaderLayout>
//             <div className={cx('wrapper')}>
//                 <div className={cx('create-event')}>
//                     <button onClick={create_event}>create event</button>
//                 </div>
//             </div>
//         </HeaderLayout>
//     );
// }

// export default CreateEvent;
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import HeaderLayout from '../../layout/header.layout';
import styles from './create.module.scss';
import classNames from 'classnames/bind';
import { Transaction } from '@mysten/sui/transactions';
import { useEffect, useState } from 'react';
import axios from 'axios';

const cx = classNames.bind(styles);

function CreateEvent() {
    const currAccount = useCurrentAccount();
    const { mutate: sae } = useSignAndExecuteTransaction();
    const [packageId, setPackageId] = useState('');
    const client = useSuiClient();
    const [digest, setDigest] = useState('');

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
                        await axios.post('http://localhost:3000/v1/event/create_event', {
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
                const res = await axios.get('http://localhost:3000/get_package_id');
                setPackageId(res.data.package_id);
            } catch (e) {
                console.error('Error fetching package ID:', e);
            }
        };
        fetch();
    }, []); // Chỉ gọi fetch packageId khi component mount

    const create_event = () => {
        if (currAccount) {
            const tx = new Transaction();
            tx.setGasBudget(10000000); // Tăng gas budget để tránh lỗi InsufficientGas
            tx.moveCall({
                target: `${packageId}::workshop::create`,
                arguments: [
                    tx.pure.address('0xf2b8341fc93d683292ba428dccf83ba443c15ee19b9f0719bdd0a7f75218c926'),
                    tx.pure.u64(3),
                    tx.pure.u64(64),
                    tx.pure.string('Sui Viet Nam bootcamp'),
                    tx.pure.string('Sui make your day'),
                    tx.pure.string(''),
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
    };

    return (
        <HeaderLayout>
            <div className={cx('wrapper')}>
                <div className={cx('create-event')}>
                    <button className={cx('create-button')} onClick={create_event}>Create Event</button>
                </div>
            </div>
        </HeaderLayout>
    );
}

export default CreateEvent;