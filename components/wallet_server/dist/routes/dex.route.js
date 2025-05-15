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
const models_1 = require("../models");
const router = express_1.default.Router();
router.post('/get_all_user_dex', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const owner = req.body.owner;
    try {
        const userDexObjects = yield models_1.DexObjectModel.find({
            owner,
        });
        console.log(userDexObjects);
        res.status(200).json(userDexObjects);
    }
    catch (error) {
        res.status(500).send(`Error while get all user dex object: ${error}`);
    }
}));
router.post('/add_user_dex', (req, res) => {
    const owner = req.body.owner;
    const dex_id = req.body.dex_id;
    const newDexObjectModel = new models_1.DexObjectModel({
        owner,
        dex_id
    });
    newDexObjectModel.save()
        .then(() => res.status(201).send('DEX created successfully'))
        .catch((err) => res.status(500).send(`Error creating DEX: ${err.message}`));
});
router.post('/delete_user_dex', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const dex_id = req.body.dex_id;
    try {
        yield models_1.DexObjectModel.findOneAndDelete({
            dex_id,
        });
        res.status(200).send('your dex has been deleted');
    }
    catch (error) {
        res.status(400).send('got error while delete DEX - Check your request');
    }
}));
exports.default = router;
