import CrudOperationError from "public/main/common/CrudOperationError.js" 
import AbstractModel from "public/main/common/AbstractModel";

/**
 * @class
 * A class representing an error that occurrs during a save operation.
 */
class StoreError extends CrudOperationError
{
    private _model: AbstractModel<any>;

    /**
     * Create a StoreError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} model The model that couldn't be saved.
     */
    constructor(path: string, location: string, model: AbstractModel<any>)
    {
        super(path, location);
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

export default StoreError;