import mongoose from 'mongoose';

export interface IEventInfo {
    event_id: string;
    event_type: string;
    event_status: string;
    title: string;
    desciption: string;
    host: string;
    endtime: Date;
    sum_participant: string;
    participation: string;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

const schema = new mongoose.Schema({
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

const EventInfo = mongoose.model('event_info', schema);

export default EventInfo;
