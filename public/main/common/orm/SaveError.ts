import CrudOperationError from "./CrudOperationError";
import AbstractStorableModel from "./AbstractStorableModel";

/**
 * @class
 * A class representing an error that occurrs during a save operation.
 */
class SaveError extends CrudOperationError
{
    private _model: AbstractStorableModel<any>;

    /**
     * Create a SaveError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} model The model that couldn't be saved.
     */
    constructor (path: string, location: string, model: AbstractStorableModel<any>)
    {
        super("An error occurred when trying to save a model.", path, location);
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

export default SaveError;