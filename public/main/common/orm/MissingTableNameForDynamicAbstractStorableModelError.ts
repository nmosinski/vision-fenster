import AbstractUncheckedError from "../util/error/AbstractUncheckedError";

class MissingTableNameForDynamicAbstractStorableModelError extends AbstractUncheckedError
{
    constructor (description: string = 'Missing table name for dynamic abstract model', file: string, location: string)
    {
        super(description, file, location);
    }
}

export default MissingTableNameForDynamicAbstractStorableModelError;