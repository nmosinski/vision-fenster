import AbstractCheckedError from "public/main/common/util/error/AbstractCheckedError.js" 

/**
 * @class
 * A class representing an error that occurrs during a CRUD related error.
 */
abstract class CrudOperationError extends AbstractCheckedError
{
    private _modelName: string;
    private _modelId: string;

    /**
     * Create a CrudOperationError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     */
    constructor(description: string, path: string, location: string)
    {
        super(description, path, location);
    }
}

export default CrudOperationError;