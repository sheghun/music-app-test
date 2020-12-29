import construct = Reflect.construct;

/**
 * Throw a badreque
 */
export class BadRequest extends Error {
    constructor(public readonly errors: string[]) {
        super(JSON.stringify(errors));
    }
}
