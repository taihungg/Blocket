import styles from './content.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Proposal, { Event_type } from '../proposal/proposal';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import axios, { all } from 'axios';
import { useSuiClient } from '@mysten/dapp-kit';

const cx = classNames.bind(styles);
interface EventOnChain{
    id: string,
    event_name: string,
    host: string,
    ticket_price: string,
    max_tickets: string,
    description: string,
    image: string,
}
function Content() {
    const [allEvent, setAllEvent] = useState<Event_type[]>([]);
    //câu response từ server xuống về thông tin sự kiện dựa trên id
    
    const client = useSuiClient();
    useEffect(() => {
        const getEvents = async () => {
            try {
                // const respone = await axios.get('https://blocketserver.vercel.app/v1/event/get_all')
                const respone = await axios.get('http://localhost:3000/v1/event/get_all');
                if (respone.data) {
                    const events = respone.data;
                    events.map(async (ev: { event_id: string }) => {
                        const eventDetail = await client.getObject({
                            id: ev.event_id,
                            options: {
                                showContent: true
                            }
                        });
                        if (eventDetail) {
                            const content = eventDetail.data?.content as any;
                            const detail: EventOnChain | null = content?.fields ? {
                                id: ev.event_id,
                                event_name: content.fields.event_name || '',
                                host: content.fields.host || '',
                                ticket_price: content.fields.ticket_price || '',
                                max_tickets: content.fields.max_tickets || '',
                                description: content.fields.description || '',
                                image: content.fields.image || '',
                            } : null;
                            if (detail) {
                                setAllEvent(prevEvents => [
                                    ...prevEvents,
                                    {
                                        event_id: detail.id,
                                        event_type: "Workshop",
                                        event_status: "Active",
                                        title: detail.event_name,
                                        description: detail.description,
                                        // host: detail.host,
                                        host: 'Blocket',
                                        endtime: "2",
                                        sum_participant: "100",
                                        participation: "72%",
                                    }
                                ]);
                            }
                        }
                    })
                }
            } catch (error) {
                console.log(error)
            }
        }
        getEvents();
    }, [])

    // const porposalDetail: Event_type = {
    //     event_id: "1",
    //     event_type: "Workshop",
    //     event_status: "Active",
    //     title: "Sui hackahouse for builders who hold SUI",
    //     desciption: "Next step of sui bootcamp for builder who hold SUI",
    //     host: "@SUIHUB",
    //     endtime: "2",
    //     sum_participant: "100",
    //     participation: "72%",
    // }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <h3>Events make your day</h3>
                    <div className={cx('buttons')}>
                        <div className={cx('button')}>
                            <Link to={'/event_create'} ><Button title="+ Create Event" /></Link>
                        </div>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                    </div>
                </div>
                <div className={cx('body')}>
                    {allEvent.map(event => (
                        <Proposal {...event}/>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Content;