import styles from './content.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Proposal, { Event_type } from '../proposal/proposal';

const cx = classNames.bind(styles);
// interface Porposal {
//     event_type: string,
//     proposal_status: string,
//     title: string,
//     desciption: string,
//     author: string,
//     endtime: string,
//     sumVotes: string,
//     participation: string,
// }
function Content() {
    //câu response từ server xuống về thông tin sự kiện dựa trên id
    const porposalDetail: Event_type = {
        event_id: "1",
        event_type: "Workshop",
        event_status: "Active",
        title: "Sui hackahouse for builders who hold SUI",
        desciption: "Next step of sui bootcamp for builder who hold SUI",
        host: "@SUIHUB",
        endtime: "2",
        sum_participant: "100",
        participation: "72%",
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <h3>Events make your day</h3>
                    <div className={cx('buttons')}>
                        <div className={cx('button')}>
                            <Button title="+ Create Event" />
                        </div>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                    </div>
                </div>
                <div className={cx('body')}>
                    <Proposal {...porposalDetail} />
                </div>
            </div>
        </div>
    );
}

export default Content;