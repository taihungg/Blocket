import mongoose from 'mongoose';

// export interface IEventInfo {
//     event_id: string;
//     event_type: string;
//     event_status: string;
//     title: string;
//     desciption: string;
//     host: string;
//     endtime: Date;
//     sum_participant: string;
//     participation: string;
//     ticket_prices: number,
//     createdAt?: Date; 
//     updatedAt?: Date; 
// }

// const schema = new mongoose.Schema({
//     event_id: { type: String, required: true },
//     event_type: { type: String, required: true },
//     event_status: { type: String, required: true },
//     title: { type: String, required: true, maxlength: 50 },
//     desciption: { type: String, required: true },
//     host: { type: String, required: true },
//     endtime: { type: Date, required: true },
//     limited_participant: { type: String, required: true },
//     participation: { type: String, required: true },
//     ticket_price: { type: Number, required: true },
// }, { timestamps: true });

// const EventInfo = mongoose.model('event_info', schema);

const eventSchema = new mongoose.Schema({
    event_id: { type: String, required: true },
}, { timestamps: true });

const EventInfo = mongoose.model('event_info', eventSchema);

export default EventInfo;
