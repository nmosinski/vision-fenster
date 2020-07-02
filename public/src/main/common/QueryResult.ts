import List from "./util/collections/list/List";
import QueryElement from "./QueryElement";
import AbstractModel from "./AbstractModel";

class QueryResult<T extends AbstractModel<T>>
{
    items: List<T>;
    constructor()
    {
        this.items = new List<T>();
    }

    /**
     * Get all primary keys of the items of this QueryResult in a new list.
     * @returns {List<string>} A list containing the primary keys of all items of this QueryResult.
     */
    toPks(): List<string>
    {
        let pks = new List<string>();
        this.items.foreach((item)=>{pks.add(item.pk);});
        return pks;
    }

    /**
     * Add an item to the QueryResult.
     * @param {T} t The item to be added. 
     */
    add(t: T)
    {
        this.items.add(t);
    }

    /**
     * Add all items of the given list to the QueryResult.
     * @param {List<T>} list The list containing all items to be added.
     */
    addAll(list: List<T>)
    {
        list.foreach((item)=>{this.items.add(item);});
    }

    /**
     * Get a number of items from the QueryResult.
     * @param {number} [count=null] The maximum count of items to be returned from the QueryResult.
     * @returns {List<T>} A list containing items from the QueryResult. 
     */
    get(count: number=null): List<T>
    {
        if(!count)
            count = this.items.length;
        return this.items.sublist(0, count);
    }

    /**
     * Get the first item from the QueryResult.
     * @returns {T} The item.
     */
    first(): T
    {
        return this.items.get(0);
    }

    /**
     * Get all items of the QueryResult.
     * @returns {List<T>} A List containing all items of the QueryResult.
     */
    all(): List<T>
    {
        return this.items;
    }

    /**
     * Check if the QueryResult is empty.
     * @returns {boolean} True if is empty, else false.
     */
    isEmpty(): boolean
    {
        return this.items.isEmpty();
    }

    get length()
    {
        return this.items.length;
    }
}

export default QueryResult