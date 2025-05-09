// components/wallet.tsx
import React, { useEffect, useState } from 'react';
import GetAllObjects from './getallobjects';
import styles from './wallet.module.scss'
import classNames from 'classnames/bind';
import { useCurrentAccount, useSignAndExecuteTransaction } from '@mysten/dapp-kit';
import HeaderLayout from '../../layout/header.layout';
import { useSuiClientQuery } from '@mysten/dapp-kit';
import { Transaction } from '@mysten/sui/transactions';
import axios from 'axios';

const cx = classNames.bind(styles);
const UserWallet: React.FC = () => {
  //sui
  const [packageId, setPackageId] = useState('');
  const currAccount = useCurrentAccount();
  const {mutate: signAndExecuteTransaction} = useSignAndExecuteTransaction();


  const { data: ownedObjects } = useSuiClientQuery('getOwnedObjects', {
    owner: currAccount?.address || '',
    options: {
      showType: true,
    },
  });

  useEffect(() => {
    const get_package_id = async () => {
      const data_res = await axios.get('http://localhost:3000/get_package_id');
      if (data_res.status === 200) {
        setPackageId(data_res.data.package_id)
      }
    }
    get_package_id();
  }, [packageId])

  useEffect(() => {
    if (ownedObjects && currAccount) {
      const tickObject = ownedObjects.data?.filter(obj => obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`);
      const tx = new Transaction();
      if (tickObject[0]?.data?.objectId) {
        if (tickObject.length > 1) {
          alert('you should merge coin first');
          let i = 1;
          let RemainCoins = [];
          while (tickObject[i]) {
            RemainCoins.push(tickObject[i].data?.objectId);
            i++;
          }
          tx.mergeCoins(tx.object(tickObject[0].data.objectId), RemainCoins.map(obj => tx.object(obj || '')))
          signAndExecuteTransaction({
            transaction: tx,
            account: currAccount,
            chain: 'sui:testnet',
          },
            {
              onSuccess: (res) => { console.log(res.digest) },
              onError: (e) => { console.log(e) }
            }
          )
        }
        else {
          console.error('Tick object ID is undefined');
        }
      }
    }
  }, [ownedObjects]);
  return (
    <HeaderLayout>
      <div className={cx('wrapper')}>
        <div className={cx('user-info')}>
          <h1>Hi User</h1>
          <p>Address: {currAccount?.address}</p>
        </div>
        <div className={cx('user-wallet')}>
          <GetAllObjects />
        </div>
      </div>
    </HeaderLayout>
  );
};

export default UserWallet;