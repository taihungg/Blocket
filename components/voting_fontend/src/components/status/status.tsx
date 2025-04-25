import styles from './status.module.scss';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpLong } from '@fortawesome/free-solid-svg-icons';
import { Report } from './components';
import React from 'react';
import { useState } from 'react';
import { jsx } from 'react/jsx-runtime';

const cx = classNames.bind(styles);
interface report_type {
    detail: string,
    icon: React.ComponentType,
    description: string,
}
function Status() {
    const [reportState, setReportState] = useState<report_type[]>([
        {
            detail: "12",
            icon: () => <FontAwesomeIcon icon={faUpLong}/>,
            description: "3 new today"
        },
        {
            detail: "3568",
            icon: () => <FontAwesomeIcon icon={faUpLong}/>,
            description: "1,289 voters"
        },
        {
            detail: "48.9k",
            icon: () => <FontAwesomeIcon icon={faUpLong}/>,
            description: "+2.5k this week"
        },
        {
            detail: "24.5",
            icon: () => <FontAwesomeIcon icon={faUpLong}/>,
            description: "Your current power"
        },
    ])
    return (
        <div className={cx('wrapper')}>
            <div className={cx('status')}>
                {
                    reportState.map(report => (
                        <Report detail={report.detail} Icon={report.icon} description={report.description}/>
                    ))
                }
            </div>
        </div>
    );
}

export default Status;