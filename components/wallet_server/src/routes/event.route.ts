import express from 'express';
import event_model from '../models/event.model';
import { IEventInfo } from '../models/event.model';

const router = express.Router();

router.get('/get_all', (req, res) => {
    res.status(200).send(event_model.find());
})

router.get('/get_by_id/:id', (req, res) => {
    const req_id = req.params.id;
    //testing untrusted input
    if (req_id) {
        res.status(200).send(event_model.findOne({ event_id: req_id }));
    }
    else {
        res.status(404).send(`cant not find event id`)
    }
});

router.post('/create_event', (req, res) => {
    const eventData: IEventInfo = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});
export default router;
