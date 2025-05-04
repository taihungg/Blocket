"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sui_prover_router = exports.event_router = void 0;
var event_route_1 = require("./event.route");
Object.defineProperty(exports, "event_router", { enumerable: true, get: function () { return __importDefault(event_route_1).default; } });
var prove_route_1 = require("./prove.route");
Object.defineProperty(exports, "sui_prover_router", { enumerable: true, get: function () { return __importDefault(prove_route_1).default; } });
