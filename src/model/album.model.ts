import * as mongoose from 'mongoose';

export interface AlbumModel extends mongoose.Document {
    name: string;
    description: string;
    date: Date;
    tracks: Array<{ name: string; file: string }>;
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

export const Album = mongoose.model<AlbumModel>('Album', albumSchema);
