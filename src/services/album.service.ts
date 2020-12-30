import { AddTrackRequest, CreateAlbumRequest } from '../interfaces/album.interface';
import { Album, AlbumModel } from '../model/album.model';
import { FileRepository } from '../repositories/file.repository';
import { BadRequestError } from '../interfaces/errors.interface';

export class AlbumService {
    static model = Album;

    /**
     * Creates and returns the newly created album
     * @param albumRequest
     */
    static async create(albumRequest: CreateAlbumRequest): Promise<AlbumModel> {
        return this.model.create(albumRequest as AlbumModel);
    }

    static getById(id: string): Promise<AlbumModel | null> {
        return this.model.findById(id);
    }

    /**
     * Updates and returns the updated album object
     * @param albumRequest
     */
    static async update(albumRequest: AlbumModel): Promise<AlbumModel | null> {
        return this.model.findByIdAndUpdate(albumRequest.id, albumRequest, { new: true });
    }

    /**
     * Deletes an album
     * @param id
     */
    static async delete(id: string) {
        return this.model.findByIdAndDelete(id);
    }

    /**
     * Adds a new track to an album
     * @param albumId
     * @param addTrackRequest
     */
    static async addTrack(albumId: string, addTrackRequest: AddTrackRequest) {
        const uploadData = await FileRepository.uploadFile(addTrackRequest.file);
        const album: AlbumModel = await this.model.findById(albumId);

        if (!album) {
            throw new BadRequestError(['Album with id does not exist']);
        }

        album.tracks = [...album.tracks, { name: addTrackRequest.name, file: uploadData.Location }] as any;

        return album.save();
    }

    /**
     * Deletes a track from the album
     * @param albumId
     * @param trackId
     */
    static async deleteTrack(albumId: string, trackId: string) {
        const album: AlbumModel = await this.model.findById(albumId);

        if (!album) {
            throw new BadRequestError(['Album with id does not exist']);
        }

        const clonedTracks: AlbumModel['tracks'] = JSON.parse(JSON.stringify(album.toJSON().tracks));
        const trackToDeleteIndex = clonedTracks.findIndex(track => track._id === trackId);

        if (trackToDeleteIndex === -1) {
            throw new BadRequestError(['Track with id does not exist']);
        }

        clonedTracks.splice(trackToDeleteIndex, 1);

        album.tracks = clonedTracks;

        return album.save();
    }

    /**
     * Edit the name of a track
     * @param albumId
     * @param trackId
     * @param name
     */
    static async updateTrack(albumId: string, trackId: string, { name }) {
        const album: AlbumModel = await this.model.findById(albumId);

        if (!album) {
            throw new BadRequestError(['Album with id does not exist']);
        }

        const clonedTracks: AlbumModel['tracks'] = JSON.parse(JSON.stringify(album.toJSON().tracks));

        const trackIndexToEdit = clonedTracks.findIndex(track => track._id === trackId);

        if (trackToDeleteIndex === -1) {
            throw new BadRequestError(['Track with id does not exist']);
        }

        clonedTracks[trackIndexToEdit] = { ...clonedTracks[trackIndexToEdit], name };

        album.tracks = clonedTracks;

        return album.save();
    }
}
