import { ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export default function inputs(validations: Array<ValidationChain>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        const errorMessages = errors
            .array()
            .map(error => error.msg)
            .filter((msg, index, array) => array.indexOf(msg) === index); // Remove duplicate error messages

        return res.status(StatusCodes.BAD_REQUEST).json({ success: false, errors: errorMessages });
    };
}
