import IStorageDriver from "../persistance/model/IStorageDriver";
import AbstractCheckedError from "../util/error/AbstractCheckedError";

/**
 * @class
 * A class representing an error that occurrs during a CRUD related error.
 */
abstract class CrudOperationError extends AbstractCheckedError
{

    private _itemId: string;
    private _tableName: string;
    private _storageDriver: IStorageDriver;

    /**
     * Create a CrudOperationError.
     * @param {string} description The description if the error.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} itemId The id of the item that caused the error.
     * @param {string} tableName The name of the table.
     * @param {IStorageDriver} storageDriver the storage driver that has been used.
     */
    constructor (description: string, path: string, location: string, itemId: string, tableName: string, storageDriver: IStorageDriver)
    {
        super(description, path, location);

    }

    /**
     * @override
     * @inheritdoc
     */
    public toString(): string
    {
        let ret = super.toString();

        ret += '\nItem id: ' + this.itemId;
        ret += '\nTable name: ' + this.tableName;
        ret += '\nStorage driver: ' + this.storageDriver;

        return ret;
    }

    get itemId(): string
    {
        return this._itemId;
    }

    set itemId(itemId: string)
    {
        this._itemId = itemId;
    }

    get tableName(): string
    {
        return this._tableName;
    }

    set tableName(tableName: string)
    {
        this._tableName = tableName;
    }

    get storageDriver(): IStorageDriver
    {
        return this._storageDriver;
    }

    set storageDriver(storageDriver: IStorageDriver)
    {
        this._storageDriver = storageDriver;
    }
}

export default CrudOperationError;