export interface CreateAlbumRequest {
    name: string;
    date: date;
    description: string;
}

export interface AddTrackRequest {
    file: any;
    name: string;
    date: string;
}
