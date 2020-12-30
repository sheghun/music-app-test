import * as mongoose from 'mongoose';
import { omitJsonFields } from './plugin/omit-json-fields.plugin';

export interface AlbumModel extends mongoose.Document {
    id: string;
    name: string;
    description: string;
    date: Date;
    tracks: Array<{ _id: string; name: string; file: string }>;
}

const albumSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        date: { type: Date, required: true },
        tracks: [],
    },
    { timestamps: true },
);

albumSchema.plugin(omitJsonFields(['__v', 'createdAt', 'updatedAt']));

export const Album = mongoose.model<AlbumModel>('Album', albumSchema);
