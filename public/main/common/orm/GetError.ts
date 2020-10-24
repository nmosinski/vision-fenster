import CrudOperationError from "./CrudOperationError";
import AbstractStorableModel from "./AbstractStorableModel";


/**
 * @class
 * A class representing an error that occurrs during a get operation.
 */
class GetError extends CrudOperationError
{
    private _modelId: string;
    private _Model: new () => AbstractStorableModel<any>;

    /**
     * Create a GetError.
     * @param {string} path The path to the file where the problem occurred.
     * @param {string} location A more specific location hint in the file where the problem occurred.
     * @param {string} modelId The model that couldn't be found.
     * @param {string} Model The models class of the requested model.
     */
    constructor (path: string, location: string, modelId: string, Model: new () => AbstractStorableModel<any>)
    {
        super("An error occurred when trying to get a model.", path, location);
        this.modelId = modelId;
        this.Model = Model;
    }

    /**
     * @override
     * @inheritdoc
     */
    toString(): string
    {
        let ret = super.toString();
        ret += "\nModel: " + (new this.Model()).tableName;
        ret += "\n" + JSON.stringify(this.Model);
        return ret;
    }

    set modelId(modelId: string)
    {
        this._modelId = modelId;
    }

    get modelId()
    {
        return this._modelId;
    }

    set Model(Model: new () => AbstractStorableModel<any>)
    {
        this._Model = Model;
    }

    get Model(): new () => AbstractStorableModel<any>
    {
        return this._Model;
    }
}

export default GetError;