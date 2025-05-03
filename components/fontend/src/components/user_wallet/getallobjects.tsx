import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import ObjectDisplay from './ObjectDisplay';
import styles from './getallobject.module.scss'
import classNames from 'classnames/bind';
// import { QRCodeSVG, QRProps } from 'qrcode.react';
import { useEffect, useState } from 'react';
import { JSX } from 'react';
import { SuiObjectResponse } from '@mysten/sui/client';
import axios from 'axios';

const cx = classNames.bind(styles);


export default function OwnedObjects() {
	const [packageId, setPackageId] = useState('');
	// const packageId = "0xecc735d2613a74d2314a0797585beff45df7c3ddb626323b167fc03d994d38e7";
	const event_name = "sui_bootcamp";
	const ticket_name = "Sui_ticket";
	const currAccount = useCurrentAccount();
	const [qr, setQr] = useState<JSX.Element | null>(null);
	const [offQr, setOffQr] = useState(true);

	useEffect(() => {
		const get_package_id = async () => {
			const data_res = await axios.get('http://localhost:3000/get_package_id');
			if (data_res.status === 200) {
				setPackageId(data_res.data.packageId)
			}
		}
		get_package_id();
	}, [packageId])

	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: currAccount?.address || '',
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
	const assets = data.data.filter(obj => (obj.data?.type === `${packageId}::${event_name}::${ticket_name}` || obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`))
	return (
		<div className={cx('wrapper')}>
			<ul className={cx('list-object')}>
				{assets?.map((object: SuiObjectResponse) => (
					<li key={object.data?.objectId} className={cx('object')}>
						<ObjectDisplay
							id={object.data?.objectId || 'undetected'}
							type={object.data?.type || 'undetected'}
							setQrCode={setQr} setOffQr={setOffQr} />
					</li>
				))}

			</ul>
			{qr && <div onClick={handleOffQR} className={cx(offQr ? 'qr-hide' : 'qr-code')}>{qr}</div>}
		</div>
	);
}