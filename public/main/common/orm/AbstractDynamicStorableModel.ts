import JsTypes from "../util/jsTypes/JsTypes";
import AbstractModel from "./AbstractModel";
import AbstractStorableModel from "./AbstractStorableModel";
import MissingTableNameForDynamicAbstractStorableModelError from "./MissingTableNameForDynamicAbstractStorableModelError";

const PATH = 'public/main/common/orm/AbstractDynamicModel';

abstract class AbstractDynamicStorableModel<Child extends AbstractStorableModel<Child>> extends AbstractStorableModel<Child>
{
    constructor (data?: object)
    {
        super(data);
        // @ts-ignore
        if (JsTypes.isUnspecified(data) || JsTypes.isUnspecified(data.tableName))
            throw new MissingTableNameForDynamicAbstractStorableModelError(undefined, PATH, 'constructor');

        // @ts-ignore    
        this._tableName = data.tableName;
    }
}

export default AbstractDynamicStorableModel;