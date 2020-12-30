import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validator.middleware';
import httpStatusCodes from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AlbumService } from '../services/album.service';

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

export const editAlbum = function editAlbum() {
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
        check('id', "id is the album and it's required")
            .exists()
            .isString()
            .isLength({ min: 2 }),
    ]),
        async (req: Request, res: Response, next: NextFunction) => {
            try {
                const album = await AlbumService.update({ ...req.body, id: req.params.id });

                return res.status(httpStatusCodes.OK).json({
                    success: true,
                    data: album,
                    message: 'Album created successfully',
                });
            } catch (err) {
                next(err);
            }
        };
};

export const deleteAlbum = function deleteAlbum() {};

export const getAlbum = function getAlbum() {};

export const getAllAlbums = function getAllAlbums() {};

export const addTrack = function addTracks() {};

export const editTrack = function editTrack() {};

export const getTrack = function getTrack() {};

export const getAllTracks = function getAllTracks() {};

export const deleteTrack = function deleteTrack() {};
