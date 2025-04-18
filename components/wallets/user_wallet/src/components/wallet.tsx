// components/wallet.tsx
import React from 'react';
import GetAllObjects from './getallobjects';

interface UserWalletProps {
  address: string;
  salt: string;
}

const UserWallet: React.FC<UserWalletProps> = ({ address, salt }) => {
    
    return (
      <div>
        <h1>hi</h1>
        <p>Address: {address}</p>
        <p>Salt: {salt}</p>
        <GetAllObjects address={address}/>
      </div>
    );
};

export default UserWallet;