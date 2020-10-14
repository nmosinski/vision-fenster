import AbstractUncheckedError from "../util/error/AbstractUncheckedError";

class MissingTableNameForDynamicAbstractModelError extends AbstractUncheckedError
{
    constructor (description: string = 'Missing table name for dynamic abstract model', file: string, location: string)
    {
        super(description, file, location);
    }
}

export default MissingTableNameForDynamicAbstractModelError;