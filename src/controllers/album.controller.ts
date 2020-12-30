import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validator.middleware';
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import { AlbumService } from '../services/album.service';
import { BadRequestError } from '../interfaces/errors.interface';
import { Album } from '../model/album.model';

export const createAlbum = [
    validatorMiddleware([
        body('name', 'album name is required')
            .exists()
            .isString()
            .isLength({ min: 2 }),
        body('description', 'album description is required')
            .exists()
            .isString()
            .isLength({ min: 2 }),
        body('date', 'album date is required and must be a valid date in ISO 8601 format')
            .exists()
            .toDate(),
    ]),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const album = await AlbumService.create(req.body);

            return res.status(httpStatusCodes.CREATED).json({
                success: true,
                data: album,
                message: 'Album created successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const editAlbum = [
    validatorMiddleware([
        body('name', 'album name should be a valid string')
            .optional()
            .isString()
            .isLength({ min: 2 }),
        body('description', 'album description should be a valid string')
            .optional()
            .isString()
            .isLength({ min: 2 }),
        body('date', 'album date is required and must be a valid date in ISO 8601 format')
            .optional()
            .toDate(),
        check('id', 'id is the id of the album, it is required and must be a valid ObjectId')
            .exists()
            .isString()
            .isHexadecimal()
            .isLength({ min: 2 }),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const album = await AlbumService.update({ ...req.body, id: req.params.id });
            if (!album) {
                throw new BadRequestError(['Album with id does not exist']);
            }

            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Album updated successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const deleteAlbum = [
    validatorMiddleware([
        check('id', "id is the album's id and it's required")
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            await AlbumService.delete(req.params.id);

            return res.status(httpStatusCodes.NO_CONTENT).json({
                success: true,
                message: 'Album deleted successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const getAlbum = [
    validatorMiddleware([
        check('id', "id is the album's id and it's required")
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const album = await AlbumService.getById(req.params.id);
            if (!album) {
                throw new BadRequestError(['Album with id does not exist']);
            }

            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Album fetched successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];
export const getAllAlbums = async function getAllAlbums(req: Request, res: Response, next: NextFunction) {
    try {
        const albums = await Album.find({});

        return res.status(httpStatusCodes.OK).json({
            success: true,
            data: albums,
            message: 'Albums retrieved successfully',
        });
    } catch (err) {
        next(err);
    }
};

export const addTrack = () => {
    const upFile = multer({ storage: multer.memoryStorage() });

    return [
        validatorMiddleware([
            check('id', "id is the album's id and it's required and must be a valid ObjectId")
                .exists()
                .isString()
                .isHexadecimal()
                .isLength({ min: 2 }),
        ]),
        upFile.single('song'),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                if (!req.body.name) {
                    throw new BadRequestError(['track name is required']);
                }

                const album = await AlbumService.addTrack(req.params.id, {
                    file: (req as any).file,
                    name: req.body.name,
                });

                return res.status(httpStatusCodes.OK).json({
                    success: true,
                    data: album,
                    message: 'Album fetched successfully',
                });
            } catch (err) {
                next(err);
            }
        },
    ];
};

export const editTrack = [
    validatorMiddleware([
        check('albumId', 'album id is required and must be a valid ObjectId')
            .exists()
            .isString()
            .isHexadecimal()
            .isLength({ min: 2 }),
        check('trackId', 'trackId is required and must be a valid ObjectId')
            .exists()
            .isString()
            .isHexadecimal()
            .isLength({ min: 2 }),
        body('name', 'name of track is required')
            .exists()
            .isString()
            .isHexadecimal()
            .isLength({ min: 2 }),
    ]),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { params, body } = req;
            const album = await AlbumService.updateTrack(params.albumId, params.trackId, {
                name: body.name,
            });

            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Album track updated successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const getTrack = [
    validatorMiddleware([
        check('albumId', 'album id is required')
            .exists()
            .isString()
            .isLength({ min: 2 }),
        check('trackId', 'trackId is required')
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { albumId, trackId } = req.params;
            const album = await AlbumService.getTrack(albumId, trackId);
            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Tracked fetched succesfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const getAllTracks = [
    validatorMiddleware([
        check('id', "id is the album's id and it's required")
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { albumId } = req.params;
            const album = await AlbumService.getTrack(albumId, null, true);
            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Tracked fetched successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];

export const deleteTrack = [
    validatorMiddleware([
        check('id', "id is the album's id and it's required")
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),

    async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { albumId, trackId } = req.params;
            const album = await AlbumService.deleteTrack(albumId, trackId);
            return res.status(httpStatusCodes.OK).json({
                success: true,
                data: album,
                message: 'Tracked fetched successfully',
            });
        } catch (err) {
            next(err);
        }
    },
];
