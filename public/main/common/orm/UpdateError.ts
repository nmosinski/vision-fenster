import AbstractStorableModel from "./AbstractStorableModel";
import CrudOperationError from "./CrudOperationError";


/**
 * @class
 * A class representing an error that occurrs during an update operation.
 */
class UpdateError extends CrudOperationError
{
    private _model: AbstractStorableModel<any>;

    /**
     * Create an UpdateError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} model The model that couldn't be updated.
     */
    constructor (path: string, location: string, model: AbstractStorableModel<any>)
    {
        super("An error occurred when trying to update a model.", path, location);
        this.model = model;
    }

    /**
     * @override
     * @inheritdoc
     */
    toString(): string
    {
        let ret = super.toString();
        ret += "\nModel: " + this.model.tableName;
        ret += "\n" + JSON.stringify(this.model);
        return ret;
    }

    set model(model: AbstractStorableModel<any>)
    {
        this._model = model;
    }

    get model(): AbstractStorableModel<any>
    {
        return this._model;
    }
}

export default UpdateError;