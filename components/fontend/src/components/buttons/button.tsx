import styles from './button.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
function Button(
    {title} : {title: string}
) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('button-wrap')}>
                <button className={cx('button')}>{title}</button>
            </div>
        </div>
    );
}
export default Button;