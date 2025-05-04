import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.config';
import { event_router } from './routes';
import { setupListeners } from './controllers/exchange.controller';

db.connect();
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
    res.send('main page')
})

app.get('/get_server_env', (_, res) => {
    res.json({
        serverPort: process.env.PORT,
        google_client_id: process.env.GOOGLE_CLIENT_ID,
        google_redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        sui_prover_endpoint: process.env.SUI_PROVER_ENDPOINT,
        dev_secret_key: process.env.SECRET_KEY,
        dev_package_id: process.env.PACKAGE_ID,
        dev_pool_tick: process.env.POOL_TICK,
    })
})

app.get('/get_package_id', (_, res) => {
    res.json({
        package_id: process.env.PACKAGE_ID
    })
})
app.get('/get_pool_id', (_, res) => {
    res.json({
        pool_id: process.env.POOL_TICK
    })
})

app.get('/v1/event', event_router);

app.listen(process.env.PORT, async () => {
    // await setupListeners();
    console.log('connect to server!!!');
})
