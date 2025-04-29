import { ConnectButton } from '@mysten/dapp-kit';
import styles from './header.module.scss';
import classNames from 'classnames/bind';
import { Link } from 'react-router';

const cx = classNames.bind(styles);
function Header() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <div className={cx('label-functions')}>
          <div className={cx('label')}>
            <img src='mizu_voting.png' />
            <h3>Ticket Block</h3>
          </div>
          <div className={cx('functions')}>
            <ul>
              <li className={cx('option')} ><Link to="/">Dashboard</Link></li>
              <li className={cx('option')} ><Link to="/buy_tick_token">Buy TICK</Link></li>
              <li className={cx('option')}><Link to="/my_wallet">My Wallet</Link></li>
              <li className={cx('option')}><Link to="/history">History</Link></li>
              <li className={cx('option')}><Link to="/settings">Settings</Link></li>
            </ul>
          </div>
        </div>
        <div className={cx('connections')}>
          <div className={cx('connect-btn')}>
            <ConnectButton/>
          </div>
          <div className={cx('avatar')}>
            <img src="mizu.jpg" alt="avatar" />
          </div>
        </div>
      </div>
    </div>
  )
}
export default Header;
