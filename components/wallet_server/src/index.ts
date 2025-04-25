import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/dist/cjs/client';
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.send('main page')
})

app.get('/get_server_env', (_, res) => {
    res.json({
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      SUI_PROVER_ENDPOINT: process.env.SUI_PROVER_ENDPOINT,
    })
})
app.post('/sign_transaction', (req, res) => {
    const client = new SuiClient({url: getFullnodeUrl('testnet')})
    const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY);
    const {transactionBytes} = req.body;
     
    const signature = keypair.signTransaction(transactionBytes);
    res.json({
        signature
    });
})

app.listen(process.env.PORT, () => {
    console.log('connect to server!!!');
})
