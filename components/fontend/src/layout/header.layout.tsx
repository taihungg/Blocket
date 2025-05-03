import { Header } from '../components';
import styles from './header.layout.module.scss';
import classNames from 'classnames/bind';
import { JSX } from 'react';

const cx = classNames.bind(styles);
import { ReactNode } from 'react';

function HeaderLayout({ children }: { children: ReactNode }) {
    return ( 
        <div className={cx("wrapper")}>
            <div className={cx("header")}>
                <Header/>
            </div>
            <div className={cx("content")}>
                {children}
            </div>
        </div>
     );
}

export default HeaderLayout;