import { useCurrentAccount, useSuiClientQuery } from '@mysten/dapp-kit';
import ObjectDisplay from './ObjectDisplay';
import styles from './getallobject.module.scss'
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { JSX } from 'react';
import { SuiObjectResponse } from '@mysten/sui/client';
import { PACKAGE_ID } from '../../App';
import axios from 'axios'

const cx = classNames.bind(styles);
// const packageId = PACKAGE_ID;

export default function OwnedObjects() {
	const [packageId, setPackageId] = useState('');
	const [qr, setQr] = useState<JSX.Element | null>(null);
	const [offQr, setOffQr] = useState(true);

	const currAccount = useCurrentAccount();
	useEffect(() => {
		const get_package_id = async () => {
			await axios.get('https://blocketserver.vercel.app/get_package_id').then(res => {
				setPackageId(res.data.package_id);
			}).catch(e => console.log(e))
		}
		get_package_id();
	}, [])

	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: currAccount?.address || '',
		options: {
			showType: true,
			showDisplay: true,
			showContent: true
		}
	});
	if (!data) {
		return null;
	}
	const handleOffQR = () => {
		setOffQr(true)
	}
	const assets = data.data.filter(obj => (obj.data?.type === `${packageId}::workshop::Ticket` || obj.data?.type === `0x2::coin::Coin<${packageId}::tick::TICK>`))
	console.log(assets)
	return (
		<div className={cx('wrapper')}>
			<ul className={cx('list-object')}>
				{assets?.map((object: SuiObjectResponse) => (
					<li key={object.data?.objectId} className={cx('object')}>
						<ObjectDisplay
							key={object.data?.objectId}
							id={object.data?.objectId || 'undetected'}
							type={object.data?.type || 'undetected'}
							name={(object.data?.content as any)?.fields?.event_name || ''}
							image_url={(object.data?.content as any)?.fields?.image_url || ''}
							setQrCode={setQr} setOffQr={setOffQr} />
					</li>
				))}

			</ul>
			{qr && <div onClick={handleOffQR} className={cx(offQr ? 'qr-hide' : 'qr-code')}>{qr}</div>}
		</div>
	);
}