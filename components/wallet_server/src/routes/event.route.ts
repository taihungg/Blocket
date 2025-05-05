import express from 'express';
import event_model from '../models/event.model';

const router = express.Router();

router.get('/get_all', async (req, res) => {
    try {
        // Truy vấn chỉ lấy trường event_id
        const events = await event_model.find()
            .select('event_id') // Chỉ lấy trường event_id
            .exec();

        // Log dữ liệu để kiểm tra
        console.log('Events (only event_id):', events);

        // Gửi dữ liệu qua res.json
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Failed to fetch events' });
    }
})

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
    const eventData: {event_id: string} = req.body; // Explicitly type req.body as IEventInfo
    const new_event = new event_model(eventData);
    new_event.save()
        .then(() => res.status(201).send('Event created successfully'))
        .catch((err) => res.status(500).send(`Error creating event: ${err.message}`));
});

export default router;
