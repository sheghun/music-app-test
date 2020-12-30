import { Router } from 'express';
import * as albumController from '../controllers/album.controller';

// Init router and path
const router = Router();

router.post('/album', albumController.createAlbum);
router.get('/albums', albumController.getAllAlbums);
router.post('/album/:albumId/track', albumController.addTrack());
router.put('/album/:albumId/track/:trackId', albumController.editTrack);
router.get('/album/:albumId/track/:trackId', albumController.getTrack);
router.delete('/album/:albumId/track/:trackId', albumController.deleteTrack);
router.get('/album/:albumId/tracks', albumController.getAllTracks);
router.get('/album/:albumId', albumController.getAlbum);
router.put('/album/:albumId', albumController.editAlbum);
router.delete('/album/:albumId', albumController.deleteAlbum);

// Export the base-router
export default router;
