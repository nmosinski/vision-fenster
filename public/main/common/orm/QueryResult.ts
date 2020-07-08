import List from "public/main/common/util/collections/list/List.js";
import AbstractModel from "public/main/common/orm/AbstractModel.js";

class QueryResult<T extends AbstractModel<T>> extends List<T>
{
    constructor(list: List<T>=null)
    {
        super((list)?list.toArray():null);
    }

    /**
     * Get all primary keys of the items of this QueryResult in a new list.
     * @returns {List<string>} A list containing the primary keys of all items of this QueryResult.
     */
    toPks(): List<string>
    {
        let pks = new List<string>();
        this.foreach((item)=>{pks.add(item.pk);});
        return pks;
    }
}

export default QueryResult;