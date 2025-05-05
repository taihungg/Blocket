import styles from './proposal.module.scss';
import classNames from 'classnames/bind';
import Button from '../buttons/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router';
import BuyTicketButton from '../../logics/buy_ticket';

const cx = classNames.bind(styles);
export interface Event_type {
    event_id: string,
    event_type: string,
    event_status: string,
    title: string,
    desciption: string,
    host: string,
    endtime: string,
    sum_participant: string,
    participation: string,
}
function Proposal(props: Event_type) {
    const {
        event_id,
        event_type,
        event_status,
        title,
        desciption,
        host,
        endtime,
        sum_participant,
        participation,
    } = props;
    return (
        <div className={cx('wrapper')}>
            <div className={cx('proposal')}>
                <div className={cx('header')}>
                    <div className={cx('type-status')}>
                        <div className={cx('type')}>
                            {event_type}
                        </div>
                        <div className={cx('status')}>
                            {event_status}
                        </div>
                    </div>

                    {/* <div className={cx('vote-btn')}>
                         <Button title="Register"/> 
                        <BuyTicketButton/>
                    </div> */}
                </div>

                <div className={cx('body')}>
                    <div className={cx('title')}>
                        <Link to={`/event_detail/${event_id}`}>{title}</Link>
                    </div>

                    <div className={cx('description')}>
                        {desciption}
                    </div>

                    <div className={cx('author-endtime')}>
                        <div className={cx('author')}>
                            <FontAwesomeIcon icon={faUser} />
                            <p>Hosted by {host}</p>
                        </div>
                        <div className={cx('endtime')}>
                            <FontAwesomeIcon icon={faClock} />
                            <p>End in {endtime} days</p>
                        </div>
                    </div>

                </div>

                <div className={cx('sumary')}>
                    <p>{sum_participant} votes cast</p>
                    <p>{participation} participation</p>
                </div>

            </div>
        </div>
    );
}

export default Proposal;