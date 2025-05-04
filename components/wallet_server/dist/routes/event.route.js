"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const event_model_1 = __importDefault(require("../models/event.model"));
const router = express_1.default.Router();
router.get('/get_all', (req, res) => {
    res.status(200).send(event_model_1.default.find());
});
router.get('/get_by_id/:id', (req, res) => {
    const req_id = req.params.id;
    //testing untrusted input
    if (req_id) {
        res.status(200).send(event_model_1.default.findOne({ event_id: req_id }));
    }
    else {
        res.status(404).send(`cant not find event id`);
    }
});
router.post('/create_event', (req, res) => {
    const eventData = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model_1.default(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});
exports.default = router;
