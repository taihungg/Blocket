import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

app.listen(process.env.PORT, () => {
    console.log('connect to server!!!');
})
