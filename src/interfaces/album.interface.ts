export interface CreateAlbumRequest {
    name: string;
    date: Date;
    description: string;
}

export interface AddTrackRequest {
    file: any;
    name: string;
}
