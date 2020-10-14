import JsTypes from "../util/jsTypes/JsTypes";
import AbstractModel from "./AbstractModel";
import MissingTableNameForDynamicAbstractModelError from "./MissingTableNameForDynamicAbstractModelError";

const PATH = 'public/main/common/orm/AbstractDynamicModel';

abstract class AbstractDynamicModel<Child extends AbstractModel<Child>> extends AbstractModel<Child>
{
    constructor (data?: object)
    {
        super(data);
        // @ts-ignore
        if (JsTypes.isUnspecified(data) || JsTypes.isUnspecified(data.tableName))
            throw new MissingTableNameForDynamicAbstractModelError(undefined, PATH, 'constructor');

        // @ts-ignore    
        this._tableName = data.tableName;
    }
}

export default AbstractDynamicModel;