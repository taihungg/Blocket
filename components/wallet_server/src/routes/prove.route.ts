import express from 'express';
import { SuiClient, getFullnodeUrl } from '@mysten/sui/client';
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';

const router = express.Router();

router.post('/sign_transaction', (req, res) => {
    const client = new SuiClient({ url: getFullnodeUrl('testnet') })
    const keypair = Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY);
    const { transactionBytes } = req.body;

    const signature = keypair.signTransaction(transactionBytes);
    res.status(200).json({
        signature
    });
})

export default router;