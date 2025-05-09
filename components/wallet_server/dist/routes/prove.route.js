"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@mysten/sui/client");
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const router = express_1.default.Router();
router.post('/sign_transaction', (req, res) => {
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)('testnet') });
    const keypair = ed25519_1.Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY);
    const { transactionBytes } = req.body;
    const signature = keypair.signTransaction(transactionBytes);
    res.status(200).json({
        signature
    });
});
exports.default = router;
