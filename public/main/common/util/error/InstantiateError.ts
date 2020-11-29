import AbstractUncheckedError from "./AbstractUncheckedError";

class InstantiateError extends AbstractUncheckedError
{
    constructor (Class: new () => unknown, file: string, location: string)
    {
        super('Could not instantiate ' + Class, file, location);
    }
}

export default InstantiateError;