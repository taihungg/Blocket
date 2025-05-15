"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const newSchema = new mongoose_1.default.Schema({
    owner: { require: true, type: String },
    dex_id: { require: true, type: String, unique: true }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('dex_object', newSchema);
