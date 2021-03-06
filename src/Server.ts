import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';

import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';

import BaseRouter from './routes';
import logger from './utils/Logger';
import mongoose from 'mongoose';
import { setId } from './model/plugin/set-id.plugin';
import { BadRequestError } from './interfaces/errors.interface';

const app = express();
const { BAD_REQUEST, INTERNAL_SERVER_ERROR } = StatusCodes;

/** ***********************************
 * SET UP DB
 * *************************************
 */
mongoose
    .connect(process.env.DB_URL as string, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: false,
        useFindAndModify: false,
    })
    .then(() => {
        /**
         * Run all logic needed after connecting to database
         */
        console.log('Connected to database');
        mongoose.plugin(setId);
    })
    .catch(error => {
        logger.err(error, true);
        throw error;
    });

/** **********************************************************************************
 *                              Set basic express settings
 ***********************************************************************************/

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Security
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

// Add APIs
app.use('/', BaseRouter);

// Print API errors
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    if (err instanceof BadRequestError) {
        return res.status(BAD_REQUEST).json({
            success: false,
            errors: err.errors,
        });
    }

    return res.status(INTERNAL_SERVER_ERROR).json({
        error: err.message,
    });
});

// Export express instance
export default app;
