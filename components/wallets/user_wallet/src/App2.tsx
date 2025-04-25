import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import UserWallet from './components/wallet';
import styles from './App.module.scss';
import genAddress from './components/create_address';

const cx = classNames.bind(styles);

// Component cho trang đăng nhập
const LoginPage = ({ onLogin }: { onLogin: (address: string) => void }) => {
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState('');
  const [rePass, setRePass] = useState('');
  const navigate = useNavigate();

  // Kiểm tra mật khẩu trong localStorage khi trang tải
  useEffect(() => {
    const storedPassword = localStorage.getItem('password');
    if (storedPassword) {
      const autoLogin = async () => {
        const address_pass = await genAddress(storedPassword);
        if (address_pass) {
          onLogin(address_pass);
          navigate('/wallet'); // Chuyển hướng đến trang ví
        } else {
          console.error('Error auto-login with stored password');
          localStorage.removeItem('password');
        }
      };
      autoLogin();
    }
  }, [navigate, onLogin]);

  const handleLoginPass = async () => {
    if (pass !== '' && rePass !== '' && pass === rePass) {
      const address_pass = await genAddress(pass);
      if (address_pass) {
        localStorage.setItem('password', pass); // Lưu mật khẩu vào localStorage
        onLogin(address_pass);
        navigate('/wallet'); // Chuyển hướng đến trang ví
      } else {
        console.error('Error generating address');
      }
    }
  };

  return (
    <div className={cx('parent')}>
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
    </div>
  );
};

// Component cho trang ví
const WalletPage = ({ address, onLogout }: { address: string; onLogout: () => void }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('password'); // Xóa mật khẩu khi đăng xuất
    onLogout();
    navigate('/login'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <div className={cx('parent')}>
      <div className={cx('wrapper')}>
        <UserWallet address={address} salt="" />
        <button className={cx('logout-btn')} onClick={handleLogout}>
          logout
        </button>
      </div>
    </div>
  );
};

// Component chính
const App = () => {
  const [passwordAddress, setPasswordAddress] = useState<string | undefined>();

  const handleLogin = (address: string) => {
    setPasswordAddress(address);
  };

  const handleLogout = () => {
    setPasswordAddress(undefined);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={<LoginPage onLogin={handleLogin} />}
        />
        <Route
          path="/wallet"
          element={
            passwordAddress ? (
              <WalletPage address={passwordAddress} onLogout={handleLogout} />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="*"
          element={<LoginPage onLogin={handleLogin} />}
        />
      </Routes>
    </Router>
  );
};

export default App;