import CrudOperationError from "./CrudOperationError";
import AbstractModel from "./AbstractModel";

/**
 * @class
 * A class representing an error that occurrs during a destroy operation.
 */
class DestroyError extends CrudOperationError
{
    private _model: AbstractModel<any>;

    /**
     * Create a DestroyError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} model The model that couldn't be destroyed.
     */
    constructor(path: string, location: string, model: AbstractModel<any>)
    {
        super("An error occurred when trying to destroy a model.", path, location);
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

    set model(model: AbstractModel<any>)
    {
        this._model = model;
    }

    get model(): AbstractModel<any>
    {
        return this._model;
    }
}

export default DestroyError;