import GetError from "../../orm/GetError";
import List from "../../util/collections/list/List";
import { AnyNumber } from "../../util/supportive";
import IStorageDriver from "./IStorageDriver";
import { Query } from "./Query";

const PATH = "public/main/common/orm/Storage";

class Storage
{
    private _storageDriver: IStorageDriver;


    constructor (storageDriver: IStorageDriver)
    {
        this.storageDriver = storageDriver;
    }

    /**
     * Get an item of the given id.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @returns {Promise<{id: string}>} the retrieved item.
     */
    async get(id: string, tableName: string): Promise<{ [x: string]: any; id?: string; }>
    {
        return await Storage.get(id, tableName, this.storageDriver);
    }

    /**
     * Get an item of the given id.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     * @returns {Promise<object>} the retrieved item.
     * @throws {GetError} if the requested item doesn't exist.
     */
    static async get(id: string, tableName: string, storageDriver: IStorageDriver): Promise<{ [x: string]: any; id?: string; }>
    {
        const item = await storageDriver.get(id, tableName);
        if (!item)
            throw new GetError(undefined, PATH, "get", id, tableName, storageDriver);
        return item;
    }

    /**
     * Check if an item of the given exists in the storage.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @returns {booelan} true if the requested item exists, else false.
     */
    async has(id: string, tableName: string): Promise<boolean>
    {
        return await Storage.has(id, tableName, this.storageDriver);
    }

    /**
     * Check if an item of the given exists in the storage.
     * @param id the id of the item to be retrieved.
     * @param tableName the name of the table in which the item is stored.
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     * @returns {booelan} true if the requested item exists, else false.
     */
    static async has(id: string, tableName: string, storageDriver: IStorageDriver): Promise<boolean>
    {
        const item = await storageDriver.get(id, tableName);
        if (!item)
            return false;
        return true;
    }

    /**
     * Get a query.
     * @param {string} tableName The name of the table this query will be applied on.
     * @return {Query} The query.
     */
    query(tableName: string): Query
    {
        return Storage.query(tableName, this.storageDriver);
    }

    /**
     * Get a query.
     * @param {string} tableName The name of the table this query will be applied on.
     * @param {IStorageDriver} storageDriver the storage driver to be used.
     * @return {Query} The query.
     */
    static query(tableName: string, storageDriver: IStorageDriver): Query
    {
        return new Query(storageDriver.query(tableName));
    }

    /**
     * Create items.
     * @param {AnyNumber<object>} toCreate the items to be created.  
     * @param {string} tableName the name of the table in which the items will be created. 
     */
    async create(toCreate: AnyNumber<object>, tableName: string): Promise<List<string>>
    {
        return await Storage.create(toCreate, tableName, this.storageDriver);
    }

    /**
     * Create items.
     * @param {AnyNumber<object>} toCreate the items to be created.  
     * @param {string} tableName the name of the table in which the items will be created.
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    static async create(toCreate: AnyNumber<object>, tableName: string, storageDriver: IStorageDriver): Promise<List<string>>
    {
        return await storageDriver.create(toCreate, tableName);
    }

    /**
     * Save items.
     * @param {AnyNumber<object>} toSave the items to be saved.  
     * @param {string} tableName the name of the table in which the items will be stored. 
     */
    async save(toSave: AnyNumber<object>, tableName: string): Promise<List<string>>
    {
        return await Storage.save(toSave, tableName, this.storageDriver);
    }

    /**
     * Save items.
     * @param {AnyNumber<object>} toSave the items to be saved.  
     * @param {string} tableName the name of the table in which the items will be stored. 
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    static async save(toSave: AnyNumber<object>, tableName: string, storageDriver: IStorageDriver): Promise<List<string>>
    {
        return await storageDriver.save(toSave, tableName);
    }

    /**
     * Update items.
     * @param {AnyNumber<{id: string}>} toUpdate the items to be updated.  
     * @param {string} tableName the name of the table in which the items will be updated. 
     */
    async update(toUpdate: AnyNumber<{ [x: string]: any; id?: string; }>, tableName: string): Promise<void>
    {
        return await Storage.update(toUpdate, tableName, this.storageDriver);
    }

    /**
     * Update items.
     * @param {AnyNumber<{id: string}>} toUpdate the items to be updated.  
     * @param {string} tableName the name of the table in which the items will be updated. 
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    static async update(toUpdate: AnyNumber<{ [x: string]: any; id?: string; }>, tableName: string, storageDriver: IStorageDriver): Promise<void>
    {
        return await storageDriver.update(toUpdate, tableName);
    }

    /**
     * Remove items.
     * @param {AnyNumber<string>} toRemove the ids of the items to be removed.  
     * @param {string} tableName the name of the table in which the items will be removed. 
     */
    async remove(toRemove: AnyNumber<string>, tableName: string): Promise<void>
    {
        return await Storage.remove(toRemove, tableName, this.storageDriver);
    }

    /**
     * Remove items.
     * @param {AnyNumber<string>} toRemove the ids of the items to be removed.  
     * @param {string} tableName the name of the table in which the items will be removed. 
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    static async remove(toRemove: AnyNumber<string>, tableName: string, storageDriver: IStorageDriver): Promise<void>
    {
        return await storageDriver.remove(toRemove, tableName);
    }

    /**
     * Remove all items in the table of the given name.
     * @param {string} tableName the name of the table of which all items will be removed.
     */
    async truncate(tableName: string): Promise<void>
    {
        return await Storage.truncate(tableName, this.storageDriver);
    }

    /**
     * Remove all items in the table of the given name.
     * @param {string} tableName the name of the table of which all items will be removed.
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    static async truncate(tableName: string, storageDriver: IStorageDriver): Promise<void>
    {
        return await storageDriver.truncate(tableName);
    }

    /**
     * Set storageDriver.
     * @param {IStorageDriver} storageDriver The storage driver to be set.
     */
    set storageDriver(storageDriver: IStorageDriver)
    {
        this._storageDriver = storageDriver;
    }

    /**
     * Get storageDriver.
     * @returns {IStorageDriver} the storage driver.
     */
    get storageDriver(): IStorageDriver
    {
        return this._storageDriver;
    }
}

export default Storage;