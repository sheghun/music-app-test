export class BadRequest extends Error {
    constructor(public readonly errors: string[]) {
        super(JSON.stringify(errors));
    }
}
