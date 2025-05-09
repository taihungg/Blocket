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
const event_model_1 = __importDefault(require("../models/event.model"));
const router = express_1.default.Router();
router.get('/get_all', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Truy vấn chỉ lấy trường event_id
        const events = yield event_model_1.default.find()
            .select('event_id') // Chỉ lấy trường event_id
            .exec();
        // Log dữ liệu để kiểm tra
        console.log('Events (only event_id):', events);
        // Gửi dữ liệu qua res.json
        res.status(200).json(events);
    }
    catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
}));
// router.get('/get_by_id/:id', (req, res) => {
//     const req_id = req.params.id;
//     //testing untrusted input
//     if (req_id) {
//         res.status(200).send(event_model.findOne({ event_id: req_id }));
//     }
//     else {
//         res.status(404).send(`cant not find event id`)
//     }
// });
router.post('/create_event', (req, res) => {
    const eventData = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model_1.default(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});
exports.default = router;
