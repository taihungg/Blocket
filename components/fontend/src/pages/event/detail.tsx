import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './detail.module.scss';
import classNames from 'classnames/bind';
import { faCalendarDays, faVideo, faSmile } from '@fortawesome/free-solid-svg-icons';
import Buy_ticket_button from '../../logics/buy_ticket';
import { useParams } from 'react-router';
import HeaderLayout from '../../layout/header.layout';
import { useEffect, useState } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';
import { Event_type } from '../../components/proposal/proposal';

const cx = classNames.bind(styles);
interface Event_detail extends Event_type {
    image_url: string;
    ticket_price: string,
}
function Detail() {
    const params = useParams();
    const client = useSuiClient();
    const [eventDetail, setEventDetail] = useState<Event_detail>();
    useEffect(() => {
        const fetchDetailEvent = async () => {
            if (params.id) {
                try {
                    const { data } = await client.getObject({
                        id: params.id,
                        options: {
                            showContent: true
                        }
                    })
                    if (data) {
                        // console.log(data)
                        const event = (data.content as any).fields as any;
                        setEventDetail({
                            event_id: params.id,
                            host: event.host,
                            image_url: event.image,
                            description: event.description,
                            title: event.event_name,
                            event_type: '',
                            event_status: '',
                            endtime: '',
                            sum_participant: '',
                            participation: '',
                            ticket_price: event.ticket_price
                        })
                    }
                } catch (error) {
                    console.log(`show detail id ${params.id} : `, error)
                }
            }
        }
        fetchDetailEvent();
    }, [params])
    // console.log(eventDetail)
    return (
        <HeaderLayout>
            <div className={cx('wrapper')}>
                <div className={cx('event-detail')}>
                    <div className={cx('detail')}>
                        <div className={cx('title')}>
                            <h2>{eventDetail?.title}</h2>
                            <p> -- Host by -- {eventDetail?.host}</p>
                        </div>
                        <div className={cx('times')}>
                            <div className={cx('date-info')}>
                                <div className={cx('icon-border')}>
                                    <FontAwesomeIcon icon={faCalendarDays} className={cx('icon')} />
                                </div>
                                <div className={cx('date-time')}>
                                    <p className={cx('date')}>Saturday, April 12</p>
                                    <p className={cx('time')}>3:00 PM - 5:00 PX GMT +7</p>
                                </div>
                            </div>
                            <div className={cx('method')}>
                                <div className={cx('icon-border')}>
                                    <FontAwesomeIcon icon={faVideo} className={cx('icon')} />
                                </div>
                                <p className={cx('method-name')}>Virtual</p>
                            </div>
                        </div>
                        <div className={cx('status')}>
                            <div className={cx('label')}>
                                <div className={cx('event-label')}>
                                    <img src={eventDetail?.image_url} alt="event-label-image" />
                                </div>
                            </div>
                            <div className={cx('thank')}>
                                <div className={cx('icon-border')}>
                                    <FontAwesomeIcon icon={faSmile} className={cx('icon')} />
                                </div>
                                <h4>Thank You for joinning</h4>
                                <h5>We hope you enjoyed the event!</h5>
                            </div>
                        </div>
                        <Buy_ticket_button workshop_id={params.id || ''} />
                        <div className={cx('about-event')}>
                            <p className={cx('')}>
                                About event
                            </p>
                        </div>

                        <div className={cx('description')}>
                            <h3>{eventDetail?.description}</h3>
                            {/* <h1>🚀 Kickstart Your Career!</h1>
                            <p>Join our <span className="highlight">First Career Development Session</span> to take your professional journey to the next level!</p>

                            <div className="section">
                                <h2>What You'll Gain:</h2>
                                <ul>
                                    <li>🎯 Personalized career advice to elevate your path.</li>
                                    <li>📝 Actionable steps to optimize your CV, LinkedIn, and job search.</li>
                                    <li>✅ A tailored plan to land your dream job.</li>
                                </ul>
                            </div>

                            <div className="section">
                                <h2>Session Details:</h2>
                                <ul>
                                    <li><strong>📅 Date & Time:</strong> 15:00 - 17:00, 12/04/2025</li>
                                    <li><strong>💻 Format:</strong> Online via Zoom (Recording available)</li>
                                    <li><strong>📝 Registration:</strong> Sign up at <a href="http://lu.ma" target="_blank" rel="nofollow noopener">Lu.ma</a></li>
                                </ul>
                            </div>

                            <div className="section">
                                <h2>Agenda:</h2>
                                <ul>
                                    <li><strong>👋 Introduction (10 mins):</strong> Session objectives and overview.</li>
                                    <li><strong>🗣 Member Updates (40-50 mins):</strong> Share your job search progress and challenges.</li>
                                    <li><strong>🧑‍🏫 Personalized Support (30-40 mins):</strong> Tailored feedback from career expert Adele.</li>
                                    <li><strong>❓ Q&A & Wrap-Up (10 mins):</strong> Open Q&A and final tips.</li>
                                </ul>
                            </div> */}
                        </div>
                    </div>

                </div>
            </div>
        </HeaderLayout>
    );
}

export default Detail;