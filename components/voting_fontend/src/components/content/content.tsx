import styles from './content.module.scss';
import classNames from 'classnames/bind';
import { Button } from '../../components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import Proposal, { Porposal_type } from '../proposal/proposal';
import { ConnectButton } from '@mysten/dapp-kit';
import {Link} from 'react-router';


const cx = classNames.bind(styles);
interface Porposal {
    proposal_type: string,
    proposal_status: string,
    title: string,
    desciption: string,
    author: string,
    endtime: string,
    sumVotes: string,
    participation: string,
}
function Content() {
    const porposalDetail: Porposal_type = {
        proposal_type: "Governance",
        proposal_status: "Active",
        title: "Community TReasury Allocation for Q3 2023",
        desciption: "Proposal to allocate 200,000 SUI from the community treasury to fund developer grants, marketing initiatives, and community events for Q3 2023.",
        author: "@sui_dao_member",
        endtime: "2",
        sumVotes: "350",
        participation: "72%",
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                <div className={cx('header')}>
                    <h3>Active Proposals</h3>
                    <div className={cx('buttons')}>
                        <div className={cx('button')}>
                            <Button title="+ Create proposals" />
                        </div>
                        <div className={cx('icon')}>
                            <FontAwesomeIcon icon={faFilter} />
                        </div>
                    </div>
                </div>
                <div className={cx('body')}>
                    <Proposal {...porposalDetail} />
                    <Proposal {...porposalDetail} />
                    <Proposal {...porposalDetail} />
                    <Proposal {...porposalDetail} />
                    <Proposal {...porposalDetail} />
                </div>
            </div>
        </div>
    );
}

export default Content;