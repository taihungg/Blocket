import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import db from './config/db.config';
import event_model from './models/event.model';
import { IEventInfo } from './models/event.model';
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
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
      GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
      SUI_PROVER_ENDPOINT: process.env.SUI_PROVER_ENDPOINT,
    })
})
app.get('/get_all_event_info', (req, res) =>{
    res.status(200).send(event_model.find());
});
app.get('/get_event_info_by_id', (req, res) => {
    if(req.body.event_id){
        res.status(200).send(event_model.findOne({event_id: req.body.event_id}));
    }
    else{
        res.status(404).send(`cant not find event id`)
    }
});
app.post('/create_event', (req, res) => {
    const eventData: IEventInfo = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});

app.post('/sign_transaction', (req, res) => {
    const client = new SuiClient({url: getFullnodeUrl('testnet')})
    const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY);
    const {transactionBytes} = req.body;
     
    const signature = keypair.signTransaction(transactionBytes);
    res.json({
        signature
    });
})

app.listen(process.env.PORT, async () => {
    await setupListeners();
    console.log('connect to server!!!');
})
