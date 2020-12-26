import List from "../../util/collections/list/List";
import { AnyNumber } from "../../util/supportive";
import IQueryDriver from "./IQueryDriver";

interface IStorageDriver
{
    /**
     * Get an item of the given id.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @returns {Promise<{id: string}>} the retrieved item.
     */
    get(id: string, tableName: string): Promise<{ [x: string]: any; id?: string; } | never | null>;

    /**
     * Check if an item of the given exists in the storage.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @returns {booelan} true if the requested item exists, else false.
     */
    has(id: string, tableName: string): Promise<boolean>;

    /**
     * Create items.
     * @param {AnyNumber<object>} toCreate the items to be created.  
     * @param {string} tableName the name of the table in which the items will be created. 
     * @returns {List<string>} the ids of the inserted items.
     */
    create(toCreate: AnyNumber<object>, tableName: string): Promise<List<string>>;

    /**
     * Save items.
     * @param {AnyNumber<object>} toSave the items to be saved.  
     * @param {string} tableName the name of the table in which the items will be stored. 
     */
    save(toSave: AnyNumber<object>, tableName: string): Promise<List<string>>;

    /**
     * Update items.
     * @param {AnyNumber<{id: string}>} toUpdate the items to be updated.  
     * @param {string} tableName the name of the table in which the items will be updated. 
     */
    update(toUpdate: AnyNumber<{ [x: string]: any; id: string; }>, tableName: string): Promise<void>;

    /**
     * Remove items.
     * @param {AnyNumber<string>} toRemove the ids of the items to be removed.  
     * @param {string} tableName the name of the table in which the items will be removed. 
     */
    remove(toRemove: AnyNumber<string>, tableName: string): Promise<void>;

    /**
     * Remove all items in the table of the given name.
     * @param {string} tableName the name of the table of which all items will be removed.
     */
    truncate(tableName: string): Promise<void>

    /**
     * Get a query.
     * @param {string} tableName The name of the table this query will be applied on.
     * @return {Query} The query.
     */
    query(tableName: string): IQueryDriver;
}

export default IStorageDriver;