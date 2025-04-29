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
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupListeners = void 0;
const client_1 = require("@mysten/sui/client");
const config_1 = require("../config/config");
const exchangeHandler_1 = require("./exchangeHandler");
const exchange_process_model_1 = require("../models/exchange_process.model");
const pack = "0x0235fe85da0560a510cfdd1e0eca805f93a1fe64b6f9da965f528e6f10cf8594";
if (!pack) {
    throw new Error('PACKAGE_ID environment variable is not set');
}
const EVENTS_TO_TRACK = [
    {
        type: `${pack}::lock`,
        filter: {
            MoveEventModule: {
                module: 'lock',
                package: pack,
            },
        },
        callback: () => exchangeHandler_1.handleLockObjects,
    },
    {
        type: `${pack}::shared`,
        filter: {
            MoveEventModule: {
                module: 'shared',
                package: pack,
            },
        },
        callback: () => exchangeHandler_1.handleEscrowObjects,
    },
];
const executeEventJob = (client, tracker, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate cursor
        if (cursor && (!cursor.txDigest || !cursor.eventSeq)) {
            throw new Error(`Invalid cursor format for tracker ${tracker.type}: ${JSON.stringify(cursor)}`);
        }
        console.log(`Querying events for tracker ${tracker.type} with cursor:`, cursor);
        const { data, hasNextPage, nextCursor } = yield client.queryEvents({
            query: tracker.filter,
            cursor: cursor || null,
            order: 'ascending',
        });
        yield tracker.callback(data, tracker.type);
        if (nextCursor && data.length > 0) {
            yield saveLatestCursor(tracker, nextCursor);
            return {
                cursor: nextCursor,
                hasNextPage,
            };
        }
    }
    catch (e) {
        console.error(`Error in executeEventJob for tracker ${tracker.type}:`, e);
        throw e;
    }
    return {
        cursor,
        hasNextPage: false,
    };
});
const runEventJob = (client, tracker, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield executeEventJob(client, tracker, cursor);
    setTimeout(() => {
        runEventJob(client, tracker, result.cursor);
    }, result.hasNextPage ? 0 : config_1.CONFIG.POLLING_INTERVAL_MS);
});
const getLatestCursor = (tracker) => __awaiter(void 0, void 0, void 0, function* () {
    const cursor = yield exchange_process_model_1.Cursor.findOne({ id: tracker.type }).exec();
    return cursor ? { eventSeq: cursor.eventSeq, txDigest: cursor.txDigest } : null;
});
const saveLatestCursor = (tracker, cursor) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        eventSeq: cursor.eventSeq,
        txDigest: cursor.txDigest,
    };
    yield exchange_process_model_1.Cursor.findOneAndUpdate({ id: tracker.type }, Object.assign({}, data), { upsert: true, new: true }).exec();
});
const setupListeners = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new client_1.SuiClient({ url: (0, client_1.getFullnodeUrl)('testnet') });
    for (const event of EVENTS_TO_TRACK) {
        runEventJob(client, event, yield getLatestCursor(event));
    }
});
exports.setupListeners = setupListeners;
