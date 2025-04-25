import styles from './proposal.module.scss';
import classNames from 'classnames/bind';
import Button from '../buttons/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUser } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);
export interface Porposal_type {
    proposal_type: string,
    proposal_status: string,
    title: string,
    desciption: string,
    author: string,
    endtime: string,
    sumVotes: string,
    participation: string,
}
function Proposal(props: Porposal_type) {
    const {
        proposal_type,
        proposal_status,
        title,
        desciption,
        author,
        endtime,
        sumVotes,
        participation,
    } = props
    return (
        <div className={cx('wrapper')}>
            <div className={cx('proposal')}>
                <div className={cx('header')}>
                    <div className={cx('type-status')}>
                        <div className={cx('type')}>
                            {proposal_type}
                        </div>
                        <div className={cx('status')}>
                            {proposal_status}
                        </div>
                    </div>

                    <div className={cx('vote-btn')}>
                        <Button title="vote"/>
                    </div>
                </div>

                <div className={cx('body')}>
                    <div className={cx('title')}>
                        {title}
                    </div>

                    <div className={cx('description')}>
                        {desciption}
                    </div>

                    <div className={cx('author-endtime')}>
                        <div className={cx('author')}>
                            <FontAwesomeIcon icon={faUser} />
                            <p>Proposed by {author}</p>
                        </div>
                        <div className={cx('endtime')}>
                            <FontAwesomeIcon icon={faClock} />
                            <p>End in {endtime} days</p>
                        </div>
                    </div>

                </div>

                <div className={cx('sumary')}>
                    <p>{sumVotes} votes cast</p>
                    <p>{participation} participation</p>
                </div>

            </div>
        </div>
    );
}

export default Proposal;