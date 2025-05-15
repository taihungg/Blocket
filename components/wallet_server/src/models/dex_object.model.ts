import { time } from 'console';
import mongoose from 'mongoose';

const newSchema = new mongoose.Schema({
    owner: {require: true, type: String},
    dex_id: {require: true, type: String, unique: true}
}, {
    timestamps: true
})

export default mongoose.model('dex_object', newSchema);