import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import styles from './exchange.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { Transaction } from '@mysten/sui/transactions';
import HeaderLayout from '../../layout/header.layout';
import { coin_unit } from '../../App';
import { PACKAGE_ID } from '../../App';

const cx = classNames.bind(styles);
interface Ticket_type {
    id: string;
    name: string;
}
const packageId = PACKAGE_ID;
function Exchange() {
    //package id 
    // const [packageId, setPackageId] = useState('');
    //for UI
    const [ticketMode, setTicketMode] = useState<number>(0);
    //submit
    const [ticketName, setTicketName] = useState('');
    const [ticketForSell, setTicketForSell] = useState('');
    const [recipient, setRecipient] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    //exchange
    const [exchangeId, setExchangeId] = useState('');
    const [exchangeAllow, setExchangeAllow] = useState(false);
    const [eventName, setEventName] = useState('');
    const [passPrice, setPassPrice] = useState(0);
    //return
    const [returnAllow, setReturnAllow] = useState(false);
    const [returnId, setReturnId] = useState('');
    const [exchangeClient, setExchangeClient] = useState('');
    //SUI config
    const client = useSuiClient();
    const currAccount = useCurrentAccount();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();
    const { data } = useSuiClientQuery('getOwnedObjects', {
        owner: currAccount?.address || '',
        options: {
            showType: true
        }
    });
    //useEffect
    // useEffect(() => {
    //     const get_package_id = async () => {
    //         const data_res = await axios.get('https://blocketserver.vercel.app/get_package_id');
    //         if (data_res.status === 200) {
    //             setPackageId(data_res.data.package_id)
    //         }
    //     }
    //     get_package_id();
    //     if (exchangeId) setExchangeAllow(true);
    // }, [packageId, exchangeId])

    useEffect(() => {
        setExchangeAllow(false);
        setReturnAllow(false);
        if (exchangeId) handleSearchExchange(exchangeId);
    }, [currAccount])

    //global variables
    const tickets = data?.data.filter(obj => obj.data?.type === `${packageId}::workshop::Ticket`)
        .map(obj => ({
            id: obj.data?.objectId || '',
            name: obj.data?.type || ''
        }));
    const tick_tokens = data?.data.filter(obj => obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`)

    //function
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
                    if (response.effects?.created?.[0]) {
                        const createdObjectId = response.effects.created[0].reference.objectId;
                        alert(
                            `Your exchange has ID: ${createdObjectId} - send it to your client`
                        );
                    } else {
                        console.log('No created objects found.');
                        alert('No created objects found.');
                    }
                    return;
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
    const handleSubmitTicket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (ticketForSell && ticketForSell !== '') {
            const tx = new Transaction();
            tx.setGasBudget(3000000);
            tx.moveCall({
                target: `${packageId}::atomic_swap::create`,
                arguments: [
                    tx.object(ticketForSell),
                    tx.pure.u64(ticketPrice * coin_unit),
                    tx.pure.address(recipient)
                ]
            })
            if (currAccount) {
                sign_execute(
                    {
                        transaction: tx,
                        account: currAccount,
                    },
                    {
                        onSuccess: async (res) => {
                            console.log(res.digest)
                            await query(res.digest);
                        },
                        onError: (e) => { console.log(e) }
                    }
                )
            }
        }
    }
    const handleSearchExchange = async (exchange_id: string) => {
        if (exchange_id && exchange_id !== '') {
            //tìm trên server 
            const { data, error } = await client.getObject({
                id: exchange_id,
                options: {
                    showContent: true,
                    showType: true,
                    showStorageRebate: true,
                    showOwner: true
                }
            })

            if (error) { console.log(error) }
            //nếu có kết quả trả về
            if (data?.type === `${packageId}::atomic_swap::Atomic_swap` && data.content?.dataType === 'moveObject') {
                const passPriceValue = (data.content.fields as any)?.pass_price;
                const fields = data.content.fields as { sender?: string };
                console.log(data.content.fields);
                setPassPrice(passPriceValue);

                if (fields.sender === currAccount?.address) {
                    setReturnAllow(true);
                    setExchangeAllow(false);

                    const sObject = (data.content.fields as any)?.s_object;
                    const exchange_client = (data.content.fields as any)?.recipient;
                    if (sObject?.fields?.event_name) {
                        setReturnId(exchange_id);
                        setTicketName(sObject.fields.event_name);
                        setExchangeClient(exchange_client);
                    } else {
                        console.error('s_object or event_name not found in fields');
                    }
                }
                if (fields.sender != currAccount?.address) {
                    setExchangeAllow(true);
                    setReturnAllow(false);

                    const sObject = (data.content.fields as any)?.s_object;
                    if (sObject?.fields?.event_name) {
                        setTicketName(sObject.fields.event_name);
                        setExchangeId(exchange_id);
                    } else {
                        console.error('s_object or event_name not found in fields');
                    }
                }
            }

        }
    }
    const handleExchange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currAccount) {
            if (tick_tokens && tick_tokens[0]) {
                const tx = new Transaction();
                tx.setGasBudget(3000000);
                tx.moveCall({
                    target: `${packageId}::atomic_swap::join_and_swap`,
                    arguments: [
                        tx.object(exchangeId),
                        tx.object(tick_tokens[0].data?.objectId || '')
                    ]
                })
                sign_execute({
                    transaction: tx,
                    account: currAccount,
                    chain: 'sui:testnet'
                },
                    {
                        onSuccess: (res) => { console.log(res.digest) },
                        onError: (err) => { console.log(err) }
                    }
                )
            }
            else {
                alert('your TICK is not enough')
            }
        }
        else {
            alert('connect wallet first!!')
        }
    }
    const handleReturnTicket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currAccount) {
            const tx = new Transaction();
            tx.moveCall({
                target: `${packageId}::atomic_swap::return_to_owner`,
                arguments: [
                    tx.object(returnId),
                ]
            });
            sign_execute({
                transaction: tx,
                account: currAccount,
                chain: 'sui:testnet'
            },
                {
                    onSuccess: (result) => { console.log(result.digest) },
                    onError: (err) => { console.error('handleExchange' + err) }
                }
            )
        }
        else {
            alert('connect wallet first!!')
        }
    }
    return (
        <HeaderLayout>

            <div className={cx('wrapper')}>
                <div className={cx('exchange')}>
                    <div className={cx('modes')}>
                        <div className={cx('ticket-sell-mode', ticketMode === 0 && 'tick-color')} onClick={() => setTicketMode(0)}>
                            Sell Ticket
                        </div>
                        <div className={cx('token-buy-mode', ticketMode === 1 && 'token-color')} onClick={() => setTicketMode(1)}>
                            buy & return
                        </div>
                    </div>
                    {ticketMode === 0 ?
                        <div className={cx('ticket')}>
                            <form onSubmit={(e) => handleSubmitTicket(e)}>
                                <label htmlFor="ticket" className={cx('ticket-input')}>Choose your ticket</label>
                                <select name="ticket" id="" className={cx('ticket-list')} onChange={e => setTicketForSell(e.target.value)}>
                                    <option value="">Choose your ticket name</option>
                                    {tickets?.map((ticket: Ticket_type) => (
                                        <option value={ticket.id} key={ticket.id}>{ticket.id}</option>
                                    ))}
                                </select>
                                <label htmlFor="prices" className={cx('price-input')} >Prices</label>
                                <input type="text" name='prices' onChange={e => setTicketPrice(parseInt(e.target.value))} />
                                <label htmlFor="recipient" className={cx('recipient-input')}>Recipient address</label>
                                <input type="text" name='recipient' onChange={e => setRecipient(e.target.value)} />
                                <button type="submit">Sell Ticket</button>
                            </form>
                        </div>
                        :
                        <div className={cx('token')}>
                            <label htmlFor="token" className={cx('token-input')}>Input Exchange Id</label>
                            <input type="text" name='token' placeholder='0xabc'
                                onChange={
                                    (e) => handleSearchExchange(e.target.value)
                                } />
                            {
                                exchangeAllow && exchangeId !== '' &&
                                <form onSubmit={e => handleExchange(e)}>
                                    <label htmlFor="tick-value" className={cx('exchange-input')}>Event name</label>
                                    <input type="text" name='tick-value' readOnly value={ticketName} />
                                    <label htmlFor="tick-value" className={cx('exchange-input')}>Prices for this ticket</label>
                                    <input type="text" name='tick-value' readOnly value={(passPrice / coin_unit) + ' TICK'} />
                                    <button type='submit'>Exchange</button>
                                </form>
                            }

                            {
                                returnAllow && returnId !== '' &&
                                <div className={cx('return-box')}>
                                    <form onSubmit={e => handleReturnTicket(e)}>
                                        <label htmlFor="tick-info" className={cx('exchange-input')}>Id</label>
                                        <input type="text" name='tick-info' readOnly value={returnId} />
                                        <label htmlFor="tick-info" className={cx('exchange-input')}>Ticket name</label>
                                        <input type="text" name='tick-info' readOnly value={ticketName} />
                                        <label htmlFor="tick-info" className={cx('exchange-input')}>Client</label>
                                        <input type="text" name='tick-info' readOnly value={exchangeClient} />
                                        <label htmlFor="tick-info" className={cx('exchange-input')}>Ticket price</label>
                                        <input type="text" name='tick-info' readOnly value={passPrice / coin_unit} />
                                        <button type='submit'>Cancel My Exchange</button>
                                    </form>
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </HeaderLayout>
    );
}

export default Exchange;