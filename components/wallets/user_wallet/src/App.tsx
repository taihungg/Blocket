import { useState } from "react";
import classNames from 'classnames/bind';
import UserWallet from './components/wallet';
import styles from './App.module.scss';
import genAddress from './components/create_address';
import { Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const cx = classNames.bind(styles);

const App = () => {
    const [hide, sethide] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [pass, setPass] = useState('');
    const [rePass, setRePass] = useState('');
    const [addressPass, setAddressPass] = useState<string | undefined>(); // Thêm state để lưu address từ mật khẩu
    const navigate = useNavigate();

    const handleLogout = () => {
        sethide(false);
        setAddressPass(undefined); // Xóa addressPass khi logout
    };

    const handleLoginPass = async () => {
        if (pass !== '' && rePass !== '' && pass === rePass) {
            const address_pass = await genAddress(pass);
            if (address_pass) {
                setAddressPass(address_pass); // Lưu address vào state
                // sethide(true); // Ẩn giao diện đăng nhập
                navigate('/wallet')
                 
            } else {
                console.error('Error generating address');
            }
        }
    };

    return (
        <div className={cx('parent')}>
            {!hide && (
                <div className={cx('wrapper')}>
                    <div className={cx('pass-login')}>
                        <h3 className={cx('pass-login-title')}>Sign in with password</h3>
                        <div className={cx('password')}>
                            <input
                                type={showPass ? "text" : "password"}
                                className={cx('pass-input')}
                                onChange={(e) => setPass(e.target.value)}
                            />
                            <button
                                className={cx('show-btn')}
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "hide" : "show"}
                            </button>
                        </div>
                        <div className={cx('password')}>
                            <input
                                type={showPass ? "text" : "password"}
                                className={cx('pass-input')}
                                onChange={(e) => setRePass(e.target.value)}
                            />
                        </div>
                        <div className={cx('not-match')}>
                            <p>{pass === rePass ? '' : 'passwords do not match'}</p>
                        </div>
                        <div className={cx(pass === rePass ? 'create-btn' : 'create-btn-hide')}>
                            <button onClick={handleLoginPass}>Sign in with password</button>
                        </div>
                    </div>
                </div>
            )}
            {/* <div className={cx('wrapper')}>
                {addressPass && (
                    <>
                        <UserWallet address={addressPass || ''} />
                        <button
                            className={cx('logout-btn')}
                            onClick={handleLogout}
                        >
                            logout
                        </button>
                    </>
                )}
            </div> */}
            <Routes>
                <Route path="/" element={<App/>}/>
                <Route path="/wallet" element={<UserWallet address={addressPass || ''}/>}/>
            </Routes>
        </div>
    );
};

export default App;