import CrudOperationError from "./CrudOperationError";
import AbstractStorableModel from "./AbstractStorableModel";
import IStorageDriver from "../persistance/model/IStorageDriver";


/**
 * @class
 * A class representing an error that occurrs during a create operation.
 */
class CreateError extends CrudOperationError
{
    /**
     * Create a CreateError.
     * @param {string} description The description if the error.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} itemId The id of the item that caused the error.
     * @param {string} tableName The name of the table.
     * @param {IStorageDriver} storageDriver the storage driver that has been used.
     */
    constructor (description: string = "An error occurred when trying to create a model", path: string, location: string, itemId: string, tableName: string, storageDriver: IStorageDriver)
    {
        super(description, path, location, itemId, tableName, storageDriver);
    }
}

export default CreateError;