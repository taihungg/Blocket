import { EventId, getFullnodeUrl, SuiClient, SuiEvent, SuiEventFilter } from '@mysten/sui/client';
import { CONFIG } from '../config/config';
import { handleEscrowObjects, handleLockObjects } from './exchangeHandler';
import { Cursor } from '../models/exchange_process.model';
const pack="0x377b4129d3bd62aa5293a17e6a0a29af0777bc0fe966ff892437e3b78f6c2f6d";

type SuiEventsCursor = EventId | null | undefined;

type EventExecutionResult = {
    cursor: SuiEventsCursor;
    hasNextPage: boolean;
};

type EventTracker = {
    type: string; // The module that defines the type, with format `package::module`
    filter: SuiEventFilter;
    callback: (events: SuiEvent[], type: string) => any;
};

if (!pack) {
    throw new Error('PACKAGE_ID environment variable is not set');
}

const EVENTS_TO_TRACK: EventTracker[] = [
    {
        type: `${pack}::lock`,
        filter: {
            MoveEventModule: {
                module: 'lock',
                package: pack,
            },
        },
        callback: () => handleLockObjects,
    },
    {
        type: `${pack}::shared`,
        filter: {
            MoveEventModule: {
                module: 'shared',
                package: pack,
            },
        },
        callback: () => handleEscrowObjects,
    },
];

const executeEventJob = async (
    client: SuiClient,
    tracker: EventTracker,
    cursor: SuiEventsCursor,
): Promise<EventExecutionResult> => {
    try {
        // Validate cursor
        if (cursor && (!cursor.txDigest || !cursor.eventSeq)) {
            throw new Error(`Invalid cursor format for tracker ${tracker.type}: ${JSON.stringify(cursor)}`);
        }

        console.log(`Querying events for tracker ${tracker.type} with cursor:`, cursor);
        const { data, hasNextPage, nextCursor } = await client.queryEvents({
            query: tracker.filter,
            cursor: cursor || null,
            order: 'ascending',
        });

        await tracker.callback(data, tracker.type);

        if (nextCursor && data.length > 0) {
            await saveLatestCursor(tracker, nextCursor);
            return {
                cursor: nextCursor,
                hasNextPage,
            };
        }
    } catch (e) {
        console.error(`Error in executeEventJob for tracker ${tracker.type}:`, e);
        throw e;
    }
    return {
        cursor,
        hasNextPage: false,
    };
};

const runEventJob = async (client: SuiClient, tracker: EventTracker, cursor: SuiEventsCursor) => {
    const result = await executeEventJob(client, tracker, cursor);

    setTimeout(
        () => {
            runEventJob(client, tracker, result.cursor);
        },
        result.hasNextPage ? 0 : CONFIG.POLLING_INTERVAL_MS,
    );
};

const getLatestCursor = async (tracker: EventTracker): Promise<SuiEventsCursor> => {
    const cursor = await Cursor.findOne({ id: tracker.type }).exec();
    return cursor ? { eventSeq: cursor.eventSeq, txDigest: cursor.txDigest } : null;
};

const saveLatestCursor = async (tracker: EventTracker, cursor: EventId) => {
    const data = {
        eventSeq: cursor.eventSeq,
        txDigest: cursor.txDigest,
    };

    await Cursor.findOneAndUpdate(
        { id: tracker.type },
        { ...data },
        { upsert: true, new: true },
    ).exec();
};

export const setupListeners = async () => {
    const client = new SuiClient({url: getFullnodeUrl('testnet')})
    for (const event of EVENTS_TO_TRACK) {
        runEventJob(client, event, await getLatestCursor(event));
    }
};