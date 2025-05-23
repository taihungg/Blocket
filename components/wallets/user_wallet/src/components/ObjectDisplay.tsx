import styles from './ObjectDisplay.module.scss';
import classNames from 'classnames/bind';
import { QRCodeSVG, QRProps } from 'qrcode.react';
import { useState } from 'react';
import { JSX } from 'react';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import { Signer } from '@mysten/sui/cryptography';


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
    
    const genQr = async () => {
        const qr_keypair = new Ed25519Keypair();
        const text = `http://127.0.0.1:5500/verify_ticket?ticket_id=${id}&&owner=${address}`;
        const encodedText = new TextEncoder().encode(text);
        const {signature} = await qr_keypair.signPersonalMessage(encodedText);
        localStorage.setItem(`QR_pub_${id}`, qr_keypair.getPublicKey().toBase64());//send to database
        localStorage.setItem(`QR_sig_${id}`, text + signature);
        setQrCode(
            <QRCodeSVG className={cx('code')}
                value={text + signature} />)
        setOffQr(false);
    }

    const getQr = () => {
        if(localStorage.getItem(`QR_pub_${id}`) !== '' && localStorage.getItem(`QR_sig_${id}`) !== ''){
            const signature = localStorage.getItem(`QR_sig_${id}`); //get from database (redis)
            if (signature) {
                setQrCode(
                    <QRCodeSVG className={cx('code')}
                        value={signature} />)
            } else {
                console.log(signature)
                genQr();
            }
            setOffQr(false);
        }
        else{
            genQr();
        }
    }

    let type_ = type.substring(type.lastIndexOf('::') + 2);
    if (type_.endsWith('>')) {
        type_ = type_.slice(0, -1);
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
                    <p>{type_}</p>
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

                    <button
                        onClick={genQr}
                    >Gen new QRCode</button>
                </div>
            </div>
        </div>
    );
}

export default ObjectDisplay;