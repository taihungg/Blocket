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
const db_config_1 = __importDefault(require("./config/db.config"));
const routes_1 = require("./routes");
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
        serverPort: process.env.PORT,
        google_client_id: process.env.GOOGLE_CLIENT_ID,
        google_redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        sui_prover_endpoint: process.env.SUI_PROVER_ENDPOINT,
        dev_secret_key: process.env.SECRET_KEY,
        dev_package_id: process.env.PACKAGE_ID,
        dev_pool_tick: process.env.POOL_TICK,
    });
});
app.get('/get_package_id', (_, res) => {
    res.json({
        package_id: process.env.PACKAGE_ID
    });
});
app.get('/get_pool_id', (_, res) => {
    res.json({
        pool_id: process.env.POOL_TICK
    });
});
app.use('/v1/event', routes_1.event_router);
app.use('/v1/dex', routes_1.dex_router);
app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    // await setupListeners();
    console.log('connect to server!!!');
}));
