import { useEffect, useState } from "react";
import axios from 'axios';
import classNames from 'classnames/bind';
import UserWallet from './components/wallet';
import styles from './App.module.scss';
import genAddress from './components/create_address';

// Giả định bạn đã cài đặt Enoki SDK
// npm install @mysten/enoki
import { EnokiClient } from '@mysten/enoki';

const cx = classNames.bind(styles);

const App = () => {
  const [hide, sethide] = useState(false);
  const [ggSign, setGGSign] = useState({
    client_id: '',
    redirect_uri: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState('');
  const [rePass, setRePass] = useState('');
  const [addressPass, setAddressPass] = useState<string | undefined>();
  const [zkLoginAddress, setZkLoginAddress] = useState<string | undefined>();

  // Khởi tạo Enoki Client với API key
  const enokiClient = new EnokiClient({
    apiKey: import.meta.env.VITE_ENOKI_API_KEY // Lấy từ .env
  });

  useEffect(() => {
    const fetch = async () => {
      const response = await axios.get('http://localhost:3000/get_server_env');
      if (response.status === 200) {
        setGGSign({
          client_id: response.data.GOOGLE_CLIENT_ID,
          redirect_uri: response.data.GOOGLE_REDIRECT_URI
        });
      }
    };
    fetch();
  }, []);

  const handleZkLogin = async () => {
    try {
      // Tạo URL xác thực cho Google
      const authUrl = await enokiClient.createAuthorizationURL({
        provider: 'google',
        clientId: ggSign.client_id,
        redirectUrl: ggSign.redirect_uri,
        extraParams: { scope: ['openid', 'email', 'profile'] }
      });

      // Chuyển hướng người dùng đến URL xác thực
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error initiating zkLogin:', error);
    }
  };

  useEffect(() => {
    // Xử lý callback sau khi người dùng xác thực
    const urlParams = new URLSearchParams(window.location.search);
    const jwt = urlParams.get('id_token');
    if (jwt) {
      const fetchAddress = async () => {
        try {
          // Lấy user salt từ backend hoặc Enoki (tùy cấu hình)
          const saltResponse = await fetch('https://salt.api.mystenlabs.com/get_salt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: jwt })
          });
          const { salt } = await saltResponse.json();

          // Tạo địa chỉ zkLogin
          const address = await enokiClient.getAddress({ jwt, salt });
          setZkLoginAddress(address);
          sethide(true); // Ẩn giao diện đăng nhập
        } catch (error) {
          console.error('Error fetching zkLogin address:', error);
        }
      };
      fetchAddress();
    }
  }, []);

  const handleLogout = () => {
    sethide(false);
    setZkLoginAddress(undefined);
    setAddressPass(undefined);
    window.history.replaceState({}, document.title, window.location.pathname); // Xóa query params
  };

  const handleLoginPass = async () => {
    if (pass !== '' && rePass !== '' && pass === rePass) {
      const address_pass = await genAddress(pass);
      if (address_pass) {
        setAddressPass(address_pass);
        sethide(true); // Ẩn giao diện đăng nhập
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
          <div className={cx('zklogin')}>
            <div>
              <button onClick={handleZkLogin}>Sign in with Google (zkLogin)</button>
            </div>
          </div>
        </div>
      )}
      <div className={cx('wrapper')}>
        {(zkLoginAddress || addressPass) && (
          <>
            <UserWallet address={zkLoginAddress || addressPass || ''} salt="" />
            <button className={cx('logout-btn')} onClick={handleLogout}>
              logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;