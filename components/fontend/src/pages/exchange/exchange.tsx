import { useCurrentAccount, useSuiClient, useSuiClientQuery } from '@mysten/dapp-kit';
import styles from './exchange.module.scss';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
interface Ticket_type {
    id: string;
    name: string;
}
function Exchange() {
    const [ticketMode, setTicketMode] = useState(true);
    const [exchangeAllow, setExchangeAllow] = useState(false);
    const [exchangeId, setExchangeId] = useState('');
    const [ticketPrice, setTicketPrice] = useState(0);
    const [listTickets, setListTickets] = useState<Ticket_type[]>([]);
    const currAccount = useCurrentAccount();
    const { data } = useSuiClientQuery('getOwnedObjects', {
        owner: currAccount?.address || '',
        options: {
            showType: true
        }
    });
    const package_id="";
    const tickets = data?.data.filter(obj => obj.data?.type === `${package_id}::sui_bootcamp::Sui_ticket`)
        .map(obj => ({
            id: obj.data?.objectId || '',
            name: obj.data?.type || ''
        }));

    if (tickets && tickets.length > 0) setListTickets(tickets);
    
    const handleSubmitTicket = () => { }
    const handleSubmitToken = () => { }
    const handleSearchExchange = () => { }
    return (
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
                        <form onSubmit={handleSubmitTicket}>
                            <label htmlFor="ticket" className={cx('ticket-input')}>Choose your ticket</label>
                            <select name="ticket" id="" className={cx('ticket-list')}>
                                <option value="">Choose your ticket name</option>
                                {listTickets.map((ticket: Ticket_type) => (
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
    );
}

export default Exchange;