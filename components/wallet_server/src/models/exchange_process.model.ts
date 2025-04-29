import mongoose from 'mongoose';

export interface ILocked {
    id?: number; // Optional because it is auto-generated
    objectId: string;
    keyId?: string;
    creator?: string;
    itemId?: string;
    deleted?: boolean; // Defaults to false
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

export interface IEscrow {
    id?: number; // Optional because it is auto-generated
    objectId: string;
    sender?: string;
    recipient?: string;
    keyId?: string;
    itemId?: string;
    swapped?: boolean; // Defaults to false
    cancelled?: boolean; // Defaults to false
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

export interface ICursor {
    id: string;
    eventSeq: string;
    txDigest: string;
    createdAt?: Date; // Automatically added by timestamps
    updatedAt?: Date; // Automatically added by timestamps
}

// Locked Schema
const LockedSchema = new mongoose.Schema({
    objectId: { type: String, unique: true, required: true },
    keyId: { type: String },
    creator: { type: String },
    itemId: { type: String },
    deleted: { type: Boolean, default: false },
}, { timestamps: true });

LockedSchema.index({ creator: 1 });
LockedSchema.index({ deleted: 1 });

export const Locked = mongoose.model('Locked', LockedSchema);

// Escrow Schema
const EscrowSchema = new mongoose.Schema({
    objectId: { type: String, unique: true, required: true },
    sender: { type: String },
    recipient: { type: String },
    keyId: { type: String },
    itemId: { type: String },
    swapped: { type: Boolean, default: false },
    cancelled: { type: Boolean, default: false },
}, { timestamps: true });

EscrowSchema.index({ recipient: 1 });
EscrowSchema.index({ sender: 1 });

export const Escrow = mongoose.model('Escrow', EscrowSchema);

// Cursor Schema
const CursorSchema = new mongoose.Schema({
    id: { type: String, required: true },
    eventSeq: { type: String, required: true },
    txDigest: { type: String, required: true },
}, { timestamps: true });

export const Cursor = mongoose.model('Cursor', CursorSchema);