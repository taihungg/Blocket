"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cursor = exports.Escrow = exports.Locked = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
// Locked Schema
const LockedSchema = new mongoose_1.default.Schema({
    objectId: { type: String, unique: true, required: true },
    keyId: { type: String },
    creator: { type: String },
    itemId: { type: String },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });
LockedSchema.index({ creator: 1 });
LockedSchema.index({ deleted: 1 });
exports.Locked = mongoose_1.default.model('Locked', LockedSchema);
// Escrow Schema
const EscrowSchema = new mongoose_1.default.Schema({
    objectId: { type: String, unique: true, required: true },
    sender: { type: String },
    recipient: { type: String },
    keyId: { type: String },
    itemId: { type: String },
    swapped: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
}, { timestamps: true });
EscrowSchema.index({ recipient: 1 });
EscrowSchema.index({ sender: 1 });
exports.Escrow = mongoose_1.default.model('Escrow', EscrowSchema);
// Cursor Schema
const CursorSchema = new mongoose_1.default.Schema({
    id: { type: String, required: true },
    eventSeq: { type: String, required: true },
    txDigest: { type: String, required: true },
}, { timestamps: true });
exports.Cursor = mongoose_1.default.model('Cursor', CursorSchema);
