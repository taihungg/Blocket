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
function Exchange() {
    const [packageId, setPackageId] = useState('');
    const [ticketMode, setTicketMode] = useState(true);
    const [exchangeAllow, setExchangeAllow] = useState(false);
    const [exchangeId, setExchangeId] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [listTickets, setListTickets] = useState<Ticket_type[]>([]);
    const currAccount = useCurrentAccount();
    const { mutate: sign_execute } = useSignAndExecuteTransaction();
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
    }, [packageId])
    // const packageId = "0xecc735d2613a74d2314a0797585beff45df7c3ddb626323b167fc03d994d38e7";
    const tickets = data?.data.filter(obj => obj.data?.type === `${packageId}::sui_bootcamp::Sui_ticket`)
        .map(obj => ({
            id: obj.data?.objectId || '',
            name: obj.data?.type || ''
        }));
    const handleSubmitTicket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tx = new Transaction();
        tx.setGasBudget(3000000);
        tx.moveCall({
            target: `${packageId}::sui_bootcamp::exchange`
        })
        if (currAccount) {
            sign_execute(
                {
                    transaction: tx,
                    account: currAccount,
                },
                {
                    onSuccess: () => { },
                    onError: () => { }
                }
            )
        }
    }
    const handleSubmitToken = () => { }
    const handleSearchExchange = () => { }
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
                            <form onSubmit={(e) => handleSubmitTicket}>
                                <label htmlFor="ticket" className={cx('ticket-input')}>Choose your ticket</label>
                                <select name="ticket" id="" className={cx('ticket-list')}>
                                    <option value="">Choose your ticket name</option>
                                    {tickets?.map((ticket: Ticket_type) => (
                                        <option value={ticket.id} key={ticket.id}>{ticket.name}</option>
                                    ))}
                                </select>
                                <label htmlFor="prices" className={cx('price-input')}>Prices</label>
                                <input type="text" name='prices' />
                                <label htmlFor="recipient" className={cx('recipient-input')}>Recipient address</label>
                                <input type="text" name='recipient' />
                            </form>
                        </div>
                        :
                        <div className={cx('token')}>
                            <form onSubmit={handleSearchExchange}>
                                <label htmlFor="token" className={cx('token-input')}>Exchange id</label>
                                <input type="text" name='token' placeholder='0xabc' />
                                <button type='submit'>search</button>
                            </form>
                            {exchangeAllow && exchangeId !== '' &&
                                <form onSubmit={handleSearchExchange}>
                                    <label htmlFor="tick-value" className={cx('exchange-input')}>Exchange id: {exchangeId}</label>
                                    <input type="text" name='tick-value' readOnly value={ticketPrice + ' TICK'} />
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