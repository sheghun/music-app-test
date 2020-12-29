import * as mongoose from 'mongoose';

// Sets the id property on the object of the model using the value of _id
export const setId = (schema: mongoose.Schema): void => {
    schema
        .virtual('id')
        .get(function(this: mongoose.Document) {
            return this._id;
        })
        .set(function(this: mongoose.Document, v: string) {
            this._id = v;
        });
};
