import styles from './ObjectDisplay.module.scss';
import classNames from 'classnames/bind';
import { QRCodeSVG, QRProps } from 'qrcode.react';
import { useState } from 'react';
import { JSX } from 'react';


const cx = classNames.bind(styles);
interface props {
    id: string,
    type: string,
    address?: string,
    description?: string,
    setQrCode: React.Dispatch<React.SetStateAction<JSX.Element | null>>,
    setOffQr: React.Dispatch<React.SetStateAction<boolean>>
}

function ObjectDisplay({ id, type, address = '', description = '', setQrCode, setOffQr }: props) {
    const getQr = () => {
        setQrCode(
            <QRCodeSVG className={cx('code')}
                value={`http://127.0.0.1:5500/verify_ticket?ticket_id=${id}&&owner=${address}`} />)
        setOffQr(false);

    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('object')}>
                <div className={cx('id')}>
                    <h3>Id of object</h3>
                    <a href={`https://suiscan.xyz/devnet/object/${id}/tx-block`}>
                        {id}
                    </a>
                </div>
                <div className={cx('type')}>
                    <h3>Type of object</h3>
                    <p>{type}</p>
                </div>

                <div className={cx('address')}>
                    <h3>Address of owner</h3>
                    <a
                        href={`https://suiscan.xyz/devnet/account/${address}`}
                    >{address}</a>
                </div>

                <div className={cx('get-qrcode-btn')}>
                    <button
                        onClick={getQr}
                    >Get QRCode</button>
                </div>
            </div>
        </div>
    );
}

export default ObjectDisplay;