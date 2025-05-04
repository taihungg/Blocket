import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import styles from './exchange.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { toHEX } from '@mysten/sui/utils';
import { Transaction } from '@mysten/sui/transactions';
import axios from 'axios';
import HeaderLayout from '../../layout/header.layout';

const cx = classNames.bind(styles);
interface Ticket_type {
    id: string;
    name: string;
}
interface Atomic_swap {
    id: string,
    pass_price: string
    recipient: string,
}
interface search_swap_respone {
    fields: Atomic_swap
}
function Exchange() {
    const [packageId, setPackageId] = useState('');
    const [ticketMode, setTicketMode] = useState(true);
    const [exchangeAllow, setExchangeAllow] = useState(false);
    const [exchangeId, setExchangeId] = useState('');
    const [listTickets, setListTickets] = useState<Ticket_type[]>([]);
    const [ticketForSell, setTicketForSell] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [recipient, setRecipient] = useState('');

    const [passPrice, setPassPrice] = useState(0);

    const currAccount = useCurrentAccount();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();

    const client = useSuiClient();
    const { data } = useSuiClientQuery('getOwnedObjects', {
        owner: currAccount?.address || '',
        options: {
            showType: true
        }
    });
    useEffect(() => {
        const get_package_id = async () => {
            const data_res = await axios.get('http://localhost:3000/get_package_id');
            if (data_res.status === 200) {
                setPackageId(data_res.data.package_id)
            }
        }
        get_package_id();
        if (exchangeId) setExchangeAllow(true);
    }, [packageId])

    // const packageId = "0xecc735d2613a74d2314a0797585beff45df7c3ddb626323b167fc03d994d38e7";
    const tickets = data?.data.filter(obj => obj.data?.type === `${packageId}::sui_bootcamp::Sui_ticket`)
        .map(obj => ({
            id: obj.data?.objectId || '',
            name: obj.data?.type || ''
        }));

    const tick_tokens = data?.data.filter(obj => obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`)

    const handleSubmitTicket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('hi')
        if (ticketForSell && ticketForSell !== '') {
            const tx = new Transaction();
            tx.setGasBudget(3000000);
            tx.moveCall({
                target: `${packageId}::atomic_swap::create`,
                arguments: [
                    tx.object(ticketForSell),
                    tx.pure.u64(ticketPrice),
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
                        onSuccess: (res) => { console.log(res.digest) },
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
                    showStorageRebate: true
                }
            })

            if (error) { console.log(error) }
            //nếu có kết quả trả về
            if (data?.type === `${packageId}::atomic_swap::Atomic_swap` && data.content?.dataType === 'moveObject') {
                const passPriceValue = (data.content.fields as any)?.pass_price;
                console.log(data.content.fields);
                setPassPrice(passPriceValue);
                setExchangeId(exchange_id);
                setExchangeAllow(true);
            }

        }
    }
    const handleExchange = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (currAccount) {
            if (tick_tokens) {
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
                        onSuccess: (res) => {console.log(res.digest)},
                        onError: (err) => {console.log(err) }
                    }
                )
            }
        }
        else {
            alert('connect wallet first!!')
        }
    }
    const handleReturnTicket = () => {

    }
    return (
        <HeaderLayout>

            <div className={cx('wrapper')}>
                <div className={cx('exchange')}>
                    <div className={cx('modes')}>
                        <div className={cx('ticket-sell-mode', ticketMode && 'tick-color')} onClick={() => setTicketMode(!ticketMode)}>
                            Sell Ticket
                        </div>
                        <div className={cx('token-buy-mode', !ticketMode && 'token-color')} onClick={() => setTicketMode(!ticketMode)}>
                            Buy
                        </div>
                    </div>
                    {ticketMode ?
                        <div className={cx('ticket')}>
                            <form onSubmit={(e) => handleSubmitTicket(e)}>
                                <label htmlFor="ticket" className={cx('ticket-input')}>Choose your ticket</label>
                                <select name="ticket" id="" className={cx('ticket-list')} onChange={e => setTicketForSell(e.target.value)}>
                                    <option value="">Choose your ticket name</option>
                                    {tickets?.map((ticket: Ticket_type) => (
                                        <option value={ticket.id} key={ticket.id}>{ticket.name}</option>
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
                            <label htmlFor="token" className={cx('token-input')}>Exchange id</label>
                            <input type="text" name='token' placeholder='0xabc' onChange={(e) => handleSearchExchange(e.target.value)} />
                            {exchangeAllow && exchangeId !== '' &&
                                <form onSubmit={e => handleExchange(e)}>
                                    <label htmlFor="tick-value" className={cx('exchange-input')}>Prices for this ticket</label>
                                    <input type="text" name='tick-value' readOnly value={passPrice + ' TICK'} />
                                    <button type='submit'>Exchange</button>
                                 </form>
                            }
                        </div>
                    }
                </div>
            </div>
        </HeaderLayout>
    );
}

export default Exchange;