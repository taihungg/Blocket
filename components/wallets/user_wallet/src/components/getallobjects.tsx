import { useSuiClientQuery } from '@mysten/dapp-kit';
import ObjectDisplay from './ObjectDisplay';
import styles from './getallobject.module.scss'
import classNames from 'classnames/bind';
import { QRCodeSVG, QRProps } from 'qrcode.react';
import { useState } from 'react';
import { JSX } from 'react';

const cx = classNames.bind(styles);


export default function OwnedObjects({ address }: { address: string }) {
	const [qr, setQr] = useState<JSX.Element | null>(null);
	const [offQr, setOffQr] = useState(true);
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
		options: {
			showType: true,
			showDisplay: true,
		}
	});
	if (!data) {
		return null;
	}
	const handleOffQR = () => {
		setOffQr(true)
	}
	return (
		<div className={cx('wrapper')}>
			<ul className={cx('list-object')}>
				{data.data.map((object) => (
					<li key={object.data?.objectId} className={cx('object')}>
						<ObjectDisplay
							id={object.data?.objectId || 'undetected'}
							type={object.data?.type || 'undetected'}
							address={address}
							setQrCode={setQr} setOffQr={setOffQr} />
					</li>
				))}
			</ul>
			{qr && <div onClick={handleOffQR} className={cx(offQr ? 'qr-hide' : 'qr-code')}>{qr}</div>}
		</div>
	);
}