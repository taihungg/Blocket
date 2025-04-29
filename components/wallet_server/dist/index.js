"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ed25519_1 = require("@mysten/sui/keypairs/ed25519");
const client_1 = require("@mysten/sui/client");
const db_config_1 = __importDefault(require("./config/db.config"));
const event_model_1 = __importDefault(require("./models/event.model"));
const exchange_controller_1 = require("./controllers/exchange.controller");
db_config_1.default.connect();
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (_, res) => {
    res.send('main page');
});
app.get('/get_server_env', (_, res) => {
    res.json({
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,
        SUI_PROVER_ENDPOINT: process.env.SUI_PROVER_ENDPOINT,
    });
});
app.get('/get_all_event_info', (req, res) => {
    res.status(200).send(event_model_1.default.find());
});
app.get('/get_event_info_by_id', (req, res) => {
    if (req.body.event_id) {
        res.status(200).send(event_model_1.default.findOne({ event_id: req.body.event_id }));
    }
    else {
        res.status(404).send(`cant not find event id`);
    }
});
app.post('/create_event', (req, res) => {
    const eventData = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model_1.default(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});
app.post('/sign_transaction', (req, res) => {
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)('testnet') });
    const keypair = ed25519_1.Ed25519Keypair.fromSecretKey(process.env.SECRET_KEY);
    const { transactionBytes } = req.body;
    const signature = keypair.signTransaction(transactionBytes);
    res.json({
        signature
    });
});
app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, exchange_controller_1.setupListeners)();
    console.log('connect to server!!!');
}));
