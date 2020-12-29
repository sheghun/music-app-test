import * as mongoose from 'mongoose';

/**
 * omitJsonField runs the Json hook and contains logic to run when converting model to json
 * @param {string[]} fieldsToOmit  - array of strings to omit from the json object
 * @param {function} extraManipulation - an optional function to define your own behavior in the json hook
 */
export const omitJsonFields = (fieldsToOmit: Array<string>, extraManipulation = (obj: object) => obj) => (
    schema: mongoose.Schema,
) => {
    schema.methods.toJSON = function() {
        let obj = this.toObject({ virtuals: true });
        fieldsToOmit.forEach(field => {
            delete obj[field];
        });

        obj = extraManipulation(obj);

        return obj;
    };
};
