// components/wallet.tsx
import React from 'react';
import GetAllObjects from './getallobjects';
import styles from './wallet.module.scss'
import classNames from 'classnames/bind';
import { useCurrentAccount } from '@mysten/dapp-kit';

const cx = classNames.bind(styles);
const UserWallet: React.FC = () => {
  const currAccount = useCurrentAccount();
  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-info')}>
        <h1>Hi User</h1>
        <p>Address: {currAccount?.address}</p>
      </div>
      <div className={cx('user-wallet')}>
        <GetAllObjects />
      </div>
    </div>
  );
};

export default UserWallet;