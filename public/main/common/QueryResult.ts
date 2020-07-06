import List from "public/main/common/util/collections/list/List.js";
import AbstractModel from "public/main/common/AbstractModel.js";

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

    /**
     * Add an item to the QueryResult.
     * @param {T} t The item to be added. 
     */
    add(t: T)
    {
        this.add(t);
    }

    /**
     * Add all items of the given list to the QueryResult.
     * @param {List<T>} list The list containing all items to be added.
     */
    addAll(list: List<T>)
    {
        list.foreach((item)=>{this.add(item);});
    }

    /**
     * Get a number of items from the QueryResult.
     * @param {number} [count=null] The maximum count of items to be returned from the QueryResult.
     * @returns {List<T>} A list containing items from the QueryResult. 
     */
    some(count: number=null): List<T>
    {
        if(!count)
            count = this.length;
        return this.sublist(0, count);
    }

    /**
     * Get the first item from the QueryResult.
     * @returns {T} The item.
     */
    first(): T
    {
        return this.get(0);
    }
}

export default QueryResult