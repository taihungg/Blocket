import { useEffect, useState } from "react";
import { generateRandomness } from "@mysten/sui/zklogin";
import { ZKLogin, useZKLogin } from "react-sui-zk-login-kit";
import axios from 'axios';
import classNames from 'classnames/bind';
import UserWallet from './components/wallet';
import styles from './App.module.scss';
import genAddress from './components/create_address';

const SUI_PROVER_ENDPOINT = 'https://prover-dev.mystenlabs.com/v1';
const cx = classNames.bind(styles);

const App = () => {
  const { encodedJwt, setUserSalt, logout, address, userSalt } = useZKLogin();
  const [hide, sethide] = useState(false);
  const [ggSign, setGGSign] = useState({
    client_id: '',
    redirect_uri: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [pass, setPass] = useState('');
  const [rePass, setRePass] = useState('');
  const [addressPass, setAddressPass] = useState<string | undefined>(); // Thêm state để lưu address từ mật khẩu

  const handleSuccess = () => {
    const props = {
      address: address ? address : '',
      salt: userSalt ? userSalt : ''
    };
    return <UserWallet {...props} />;
  };

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

    if (encodedJwt) {
      const requestMock = new Promise(
        (resolve): void =>
          resolve(localStorage.getItem("userSalt") || generateRandomness())
      );
      requestMock.then(salt => setUserSalt(String(salt)));
    }
  }, [encodedJwt]);

  const providers = {
    google: {
      clientId: ggSign.client_id,
      redirectURI: ggSign.redirect_uri,
    },
    twitch: {
      clientId: "YOUR_TWITCH_CLIENT_ID",
      redirectURI: "YOUR_REDIRECT_URI",
    }
  };

  const handleLogout = () => {
    sethide(false);
    setAddressPass(undefined); // Xóa addressPass khi logout
    logout();
  };

  const handleLoginPass = async () => {
    if (pass !== '' && rePass !== '' && pass === rePass) {
      const address_pass = await genAddress(pass);
      if (address_pass) {
        setAddressPass(address_pass); // Lưu address vào state
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
              <ZKLogin
                onSuccess={() => sethide(true)}
                providers={providers}
                proverProvider={SUI_PROVER_ENDPOINT}
              />
            </div>
          </div>
        </div>
      )}
      <div className={cx('wrapper')}>
        {(address || addressPass) && (
          <>
            {address ? handleSuccess() : <UserWallet address={addressPass || ''} salt="" />}
            <button
              className={cx('logout-btn')}
              onClick={handleLogout}
            >
              logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default App;