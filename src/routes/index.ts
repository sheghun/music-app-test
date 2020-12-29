import { Router } from 'express';
import * as albumController from '../controllers/album.controller';

// Init router and path
const router = Router();

router.post('/album', albumController.createAlbum);
router.get('/albums', albumController.getAllAlbums);
router.post('/album/:id/track', albumController.addTrack);
router.put('/album/:id/track/:id', albumController.editTrack);
router.get('/album/:id/track/:id', albumController.getTrack);
router.delete('/album/:id/track/:id', albumController.deleteTrack);
router.get('/album/:id/tracks', albumController.getAllTracks);
router.get('/album/id', albumController.getAlbum);
router.put('/album/:id', albumController.editAlbum);
router.delete('/album/:id', albumController.deleteAlbum);

// Export the base-router
export default router;
