import styles from './report.module.scss';
import classNames from 'classnames/bind';
import React from 'react';

const cx = classNames.bind(styles);
function Report({ detail, Icon, description }: { detail: string, Icon: React.ComponentType, description: string }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('report')}>
                <h3 className={cx('title')}>Active Proposals</h3>
                <h3 className={cx('status')}>{detail}</h3>
                <div className={cx('update')}>
                    <Icon />
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
}

export default Report;