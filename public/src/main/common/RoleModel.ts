import AbstractModel from "./AbstractModel";
import IComparable from "./util/IComparable";

class RoleModel extends AbstractModel<RoleModel> implements IComparable<RoleModel>
{
    private _model1: AbstractModel<any>;
    private _model2: AbstractModel<any>;
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
    equals(roleModel: RoleModel): boolean
    {
        if(this.hasReference(roleModel.model1) && this.hasReference(roleModel.model2))
            return true;
        return false;
    }

    hasReference(model: AbstractModel<any>): boolean
    {
        if(this.model1.constructor === model.constructor && this.model1.pk === model.pk)
            return true;
        if(this.model2.constructor === model.constructor && this.model2.pk === model.pk)
            return true;
        return false;
    }

    newInstance(): RoleModel 
    {
        return new RoleModel(null, null);
    }

    /**
     * @override
     * @inheritdoc
     */
    get tableName()
    {
        return AbstractModel.roleTableNameOf(this.model1.tableName, this.model2.tableName);
    }

    get model1()
    {
        return this._model1;
    }

    get model2()
    {
        return this._model2;
    }

    set model1(model)
    {
        this._model1 = model;
    }

    set model2(model)
    {
        this._model2 = model;
    }
}

export default RoleModel;