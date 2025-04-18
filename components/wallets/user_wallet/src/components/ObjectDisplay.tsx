import styles from './ObjectDisplay.module.scss';
import classNames from 'classnames/bind';
import qrcode, { QRCodeSegment } from 'qrcode';
import { useState, useEffect } from 'react';

const cx = classNames.bind(styles);
interface props {
    id: string,
    type: string,
    address?: string,
    description?: string,
}
function QRCode_generator(id: string, address: string) {
    // const text: QRCodeSegment[] = [
    //     {data: id, mode:'kanji'},
    //     {data: address, mode:'kanji'},
    // ];
    // const url_code = qrcode.toDataURL(text).then(code => {
    //     console.log(code)
    // })
    //     .catch(e => console.log(e));

    const link = `http://localhost:3000/check_ticket?id=${id}&&address=${address}`;

    return qrcode.toCanvas(link).then(code => code).catch(e => console.log(e))
}

function ObjectDisplay({ id, type, address = '', description = '' }: props) {
    const [qrcodeImage, setQrcodeImage] = useState<HTMLCanvasElement | null>(null);

    // useEffect(() => {
    //     QRCode_generator(id, address).then((canvas) => {
    //         if (canvas instanceof HTMLCanvasElement) {
    //             setQrcodeImage(canvas);
    //         }
    //     });
    // }, [id, address]);
    const get_qrcode = () => {
        QRCode_generator(id, address).then((canvas) => {
            if (canvas) {
                setQrcodeImage(canvas);
            }
        });
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
                        onClick={get_qrcode}
                    >Get QRCode</button>
                </div>

                <div className={cx('qr-code')}>
                    <canvas
                        className={cx('code')}
                        ref={node => {
                            if (node && qrcodeImage) {
                                node.replaceWith(qrcodeImage);
                            }
                        }} />
                </div>
            </div>
        </div>
    );
}

export default ObjectDisplay;