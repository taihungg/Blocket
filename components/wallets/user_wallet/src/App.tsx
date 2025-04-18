import { useEffect, useState } from 'react'
import './App.css';
import axios from 'axios';
import { ZKLogin, useZKLogin} from 'react-sui-zk-login-kit';
import {generateRandomness} from '@mysten/sui/zklogin';

function App() {
  const [suiEndpoint, setSuiEndPoint] = useState('');
  const [ggSign, setGGSign] = useState({
    client_id: '',
    redirect_uri: ''
  });
  const {encodedJwt, userSalt, setUserSalt, address, logout} = useZKLogin();

  useEffect(() => {
    const fectch = async () => {
      const response = await axios.get('http://localhost:3000/get_server_env');
      if(response.status === 200){
          setGGSign({
            client_id: response.data.GOOGLE_CLIENT_ID,
            redirect_uri: response.data.GOOGLE_REDIRECT_URI 
          });
          setSuiEndPoint(response.data.SUI_PROVER_ENDPOINT);
      }
    };
    fectch();
    if(encodedJwt){
      const requestMock = new Promise(
        (resolve): void => resolve(localStorage.getItem("userSalt") || generateRandomness())
      );

      requestMock.then(salt => setUserSalt(String(salt)));
    }
  }, [encodedJwt])

  return (
    <>
      <ZKLogin
        providers={{
          google:{
            clientId: ggSign.client_id,
            redirectURI: ggSign.redirect_uri
          }
        }} 
        proverProvider={suiEndpoint}
      />
      {address && (<div>{address}</div>)}
    </>
  )
}

export default App
