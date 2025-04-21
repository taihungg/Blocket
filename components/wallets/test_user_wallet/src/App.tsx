import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import "./App.css";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  generateNonce,
  generateRandomness,
  jwtToAddress,
  getExtendedEphemeralPublicKey,
} from "@mysten/sui/zklogin";
import {toBase64} from '@mysten/sui/utils';
import axios from 'axios';
import { client_id } from "./main";

export interface JwtPayload {
  iss?: string;
  sub?: string; //Subject ID
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  nonce?: string,
}

async function handleZklogin() {
  const suiclient = new SuiClient({ url: getFullnodeUrl("devnet") });
  const { epoch } = await suiclient.getLatestSuiSystemState();

  const maxEpoch = Number(epoch) + 2;
  const ephemeralKeypair = new Ed25519Keypair();
  const randomness = generateRandomness();
  const nonce = generateNonce(
    ephemeralKeypair.getPublicKey(),
    maxEpoch,
    randomness
  );
  const redirect_uri = 'http://127.0.0.1:5500/'
  const gg_oauth = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&response_type=id_token&redirect_uri=${redirect_uri}&scope=openid&nonce=${nonce}`
  

  let randomJWT = "";
  let salt: string = "";
  if (jwt) {
    // Generate a 16-byte random salt
    const userSalt = localStorage.getItem("userSalt") || generateRandomness();
    const rJWT= generateRandomness();
    randomJWT = rJWT;
    salt = String(userSalt);

  }
  localStorage.setItem("userSalt", salt);

  const zklogin_user_address = jwtToAddress(jwt, salt);
  const extend_emphemeral_publickey = getExtendedEphemeralPublicKey(ephemeralKeypair.getPublicKey());

  const prover_url = "https://prover-dev.mystenlabs.com/v1";

  const data = {
    jwt: jwt,
    extendedEphemeralPublicKey: toBase64(new TextEncoder().encode(extend_emphemeral_publickey)),
    maxEpoch,
    jwtRandomness: randomJWT,
    salt,
    keyClaimName: "sub"
  };
  await axios.post(prover_url, data, {
    headers:{
      'Content-Type' : 'application/json'
    }
  }).then(respone => {
    console.log(respone)
  }).catch(e => console.log('error on axios: ', e))
  return {salt, nonce, zklogin_user_address};
}

function App() {
  const handleSuccess = () => {
    //redirect
    handleZklogin()
      .then((res) => console.log(res))
      .catch((e) => console.log(e));
  };
  const handleError = () => {
    console.log("got error");
  };
  return (
    <div className="wrapper">
      <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
    </div>
  );
}

export default App;
