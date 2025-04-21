// components/wallet.tsx
import React from 'react';
import GetAllObjects from './getallobjects';
import styles from './wallet.module.scss'
import classNames from 'classnames/bind';


interface UserWalletProps {
  address: string;
  salt: string;
}
const cx = classNames.bind(styles);
const UserWallet: React.FC<UserWalletProps> = ({ address, salt }) => {

  return (
    <div className={cx('wrapper')}>
      <div className={cx('user-info')}>
        <h1>hi user</h1>
        <p>Address: {address}</p>
        <p>Salt: {salt}</p>
      </div>
      <div className={cx('user-wallet')}>
        <GetAllObjects address={address} />
      </div>
    </div>
  );
};

export default UserWallet;