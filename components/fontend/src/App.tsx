import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { Header, Status, Content } from './components';

const cx = classNames.bind(styles);
// const PACKAGE_ID="0xa3d0a8ea1a38276eb0e832097c4a455b6c9ca92929906c3a8ce3976c29ff4452"
// const POOL_TICK="0xccdd18d7af2e2a4f26ad2f41a80ef93e94f85225c10c8d66903003a01122483b"

const PACKAGE_ID="0xbc4969f6ac129a337fa2b8e94acf2be02ece9a5a1e39fead011efe51d637add6";
const POOL_TICK="0xc0c9af53206b251903e84f10001674598d9c64243a3ed0048b3d56bcb17a7070";
function App() {
  return (
    <div className={cx('wrapper')}>
      <div className={cx('header')}>
        <Header />
      </div>
      <div className={cx('body')}>
        <div className={cx('status')}>
          <Status />
        </div>
        <div className={cx('content')}>
          <Content/>
        </div>
      </div>
    </div>
  )
}
export {PACKAGE_ID, POOL_TICK}
export default App
