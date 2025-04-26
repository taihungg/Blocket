import React from 'react';
import styles from './App.module.scss';
import classNames from 'classnames/bind';
import { Header, Status, Content } from './components';

const cx = classNames.bind(styles);
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

export default App
