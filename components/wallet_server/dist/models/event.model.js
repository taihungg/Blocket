"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const schema = new mongoose_1.default.Schema({
    event_id: { type: String, required: true },
    event_type: { type: String, required: true },
    event_status: { type: String, required: true },
    title: { type: String, required: true, maxlength: 50 },
    desciption: { type: String, required: true },
    host: { type: String, required: true },
    endtime: { type: Date, required: true },
    sum_participant: { type: String, required: true },
    participation: { type: String, required: true },
}, { timestamps: true });
const EventInfo = mongoose_1.default.model('event_info', schema);
exports.default = EventInfo;
