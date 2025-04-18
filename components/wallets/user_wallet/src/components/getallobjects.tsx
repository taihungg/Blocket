import { useSuiClientQuery } from '@mysten/dapp-kit';
import ObjectDisplay from './ObjectDisplay';
import styles from './getallobject.module.scss'
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);


export default function OwnedObjects({ address }: { address: string }) {
	const { data } = useSuiClientQuery('getOwnedObjects', {
		owner: address,
		options: {
			showType: true
		}
	});
	if (!data) {
		return null;
	}

	return (
		<div className={cx('wrapper')}>
			<ul className={cx('list-object')}>
				{data.data.map((object) => (
					<li key={object.data?.objectId} className={cx('object')}>
						<ObjectDisplay id={object.data?.objectId || 'undetected'} type={object.data?.type || 'undetected'} address={address}/>
					</li>
				))}
			</ul>
		</div>
	);
}