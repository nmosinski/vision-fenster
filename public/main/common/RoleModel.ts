import AbstractModel from "public/main/common/AbstractModel.js";
//import IComparable from "public/main/common/util/IComparable.js";

/**
 * @class
 * A class representing a dummy model for accessing the role table of two other models.
 */
class RoleModel extends AbstractModel<RoleModel> implements IComparable
{
    private _model1: AbstractModel<any>;
    private _model2: AbstractModel<any>;
    /**
     * Create a dummy RoleModel for accessing the role table of the given two models.
     * @param {AbstractModel<any>} model1 A model.
     * @param {AbstractModel<any>} model2 Another model.
     */
    constructor(model1: AbstractModel<any>, model2: AbstractModel<any>)
    {
        super();
        this.model1 = model1;
        this.model2 = model2;
        this[model1.asFk()] = model1.pk;
        this[model2.asFk()] = model2.pk;
    }

    /**
     * @override
     * @inheritdoc
     */
    equals(roleModel: any): boolean
    {
        if(!(roleModel instanceof RoleModel))
            return false;
        if(this.hasReference(roleModel.model1) && this.hasReference(roleModel.model2))
            return true;
        return false;
    }

    /**
     * Check if this role model refers to the given model.
     * @param {AbstractModel<any>} model The model this RoleModel is maybe referring to.
     * @return {boolean} True if this model refers to the given model, else false. 
     */
    hasReference(model: AbstractModel<any>): boolean
    {
        if(this.model1.constructor === model.constructor && this.model1.pk === model.pk)
            return true;
        if(this.model2.constructor === model.constructor && this.model2.pk === model.pk)
            return true;
        return false;
    }

    /**
     * @override
     * @inheritdoc
     */
    newInstance(): RoleModel 
    {
        return new RoleModel(null, null);
    }

    /**
     * @overrride
     * @inheritdoc
     */
    addRelations(): void 
    {
        // Nothing to add.
    }

    /**
     * @override
     * @inheritdoc
     */
    get tableName(): string
    {
        return AbstractModel.roleTableNameOf(this.model1.tableName, this.model2.tableName);
    }

    /**
     * Get the first model this RoleTable refers to.
     * @returns {AbstractModel<any>} The first model this RoleModel refers to.
     */
    get model1(): AbstractModel<any>
    {
        return this._model1;
    }

    /**
     * Get the second model this RoleTable refers to.
     * @returns {AbstractModel<any>} The second model this RoleModel refers to.
     */
    get model2(): AbstractModel<any>
    {
        return this._model2;
    }

    /**
     * Set the first model this RoleTable refers to.
     * @param {AbstractModel<any>} model The first model this RoleModel refers to.
     */
    set model1(model: AbstractModel<any>)
    {
        this._model1 = model;
    }

    /**
     * Set the second model this RoleTable refers to.
     * @param {AbstractModel<any>} model The second model this RoleModel refers to.
     */
    set model2(model: AbstractModel<any>)
    {
        this._model2 = model;
    }
}

export default RoleModel;