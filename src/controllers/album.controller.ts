import { body } from 'express-validator';
import validatorMiddleware from '../middlewares/validator.middleware';
import {NextFunction} from "express";

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

    }
];

export const editAlbum = function editAlbum() {};

export const deleteAlbum = function deleteAlbum() {};

export const getAlbum = function getAlbum() {};

export const getAllAlbums = function getAllAlbums() {};

export const addTrack = function addTracks() {};

export const editTrack = function editTrack() {};

export const getTrack = function getTrack() {};

export const getAllTracks = function getAllTracks() {};

export const deleteTrack = function deleteTrack() {};
