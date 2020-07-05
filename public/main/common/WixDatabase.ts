import wixData from "wix-data";
import AbstractModel from "public/main/common/AbstractModel.js";
import QueryResult from "public/main/common/QueryResult.js";
import List from "public/main/common/util/collections/list/List.js";


class WixDatabase<T extends AbstractModel<T>>
{
    private _model: T;
    
    constructor(model: T)
    {
        this.model = model;
    }

    /**
     * Get an item of the given id.
     * @param {string} id The id of the item to be returned.
     * @returns {T} The item of the given id.
     */
    async get(id: string, model: T): Promise<T>
    {
        return await WixDatabase.get(id, this.model);
    }

    /**
     * Get an item of the given id.
     * @param {string} id The id of the item to be returned.
     * @returns {U} The item of the given id.
     */
    static async get<U extends AbstractModel<U>>(id: string, model: U): Promise<U>
    {
        return wixQueryItemToModel(await wixData.get(model.tableName, id), model);
    }

    /**
     * Get a query.
     * @return {Query<T>} The query.
     */
    query(): Query<T>
    {
        return WixDatabase.query(this.model);
    }

    /**
     * Get a query.
     * @return {Query<U>} The query.
     */
    static query<U extends AbstractModel<U>>(model: U): Query<U>
    {
        return new Query(model);
    }

    /**
     * Save an item.
     * @param {T} toSave The item to be saved. 
     */
    async save(toSave: T): Promise<void>
    {
        return await WixDatabase.save(toSave);
    }

    /**
     * Save an item.
     * @param {U} toSave The item to be saved. 
     */
    static async save<U extends AbstractModel<U>>(toSave: U): Promise<void>
    {
        await wixData.save(toSave.tableName, toSave);
    }

    /**
     * Save multiple items.
     * @param {T} toSave The items to be saved. 
     */
    async saveMultiple(toSave: List<T>): Promise<void>
    {
        return await WixDatabase.saveMultiple(toSave);
    }

    /**
     * Save multiple items.
     * @param {U} toSave The items to be saved. 
     */
    static async saveMultiple<U extends AbstractModel<U>>(toSave: List<U>): Promise<void>
    {
        if(toSave.isEmpty())
            return;
        wixData.bulkSave(toSave.get(0).tableName, toSave.toArray());
    }

    /**
     * Save an item.
     * @param {T} toSave The item to be saved. 
     */
    async update(toUpdate: T): Promise<void>
    {
        return await WixDatabase.update(toUpdate);
    }

    /**
     * Save an item.
     * @param {U} toSave The item to be saved. 
     */
    static async update<U extends AbstractModel<U>>(toUpdate: U): Promise<void>
    {
        await wixData.update(toUpdate.tableName, toUpdate);
    }

    /**
     * Update multiple items.
     * @param {T} toUpdate The items to be updated. 
     */
    async updateMultiple(toUpdate: List<T>): Promise<void>
    {
        return await WixDatabase.updateMultiple(toUpdate);
    }

    /**
     * Update multiple items.
     * @param {U} toUpdate The items to be updated. 
     */
    static async updateMultiple<U extends AbstractModel<U>>(toUpdate: List<U>): Promise<void>
    {
        if(toUpdate.isEmpty())
            return;
        wixData.bulkUpdate(toUpdate.get(0).tableName, toUpdate.toArray());
    }

    /**
     * Remove an item.
     * @param {T} toRemove The item to be removed. 
     */
    async remove(toRemove: T): Promise<void>
    {
        return await WixDatabase.remove(toRemove);
    }

    /**
     * Remove an item.
     * @param {U} toRemove The item to be removed. 
     */
    static async remove<U extends AbstractModel<U>>(toRemove: U): Promise<void>
    {
        await wixData.remove(toRemove.tableName, toRemove.pk);
    }

    /**
     * Remove multiple items.
     * @param {T} toRemove The items to be removed. 
     */
    async removeMultiple(toRemove: List<T>): Promise<void>
    {
        return await WixDatabase.removeMultiple(toRemove);
    }

    /**
     * Remove multiple items.
     * @param {U} toRemove The items to be removed. 
     */
    static async removeMultiple<U extends AbstractModel<U>>(toRemove: List<U>): Promise<void>
    {
        if(toRemove.isEmpty())
            return;
        wixData.bulkRemove(toRemove.get(0).tableName, toRemove.toArray());
    }

    /**
     * Set model.
     * @param {T} model The model to be set.
     */
    set model(model: T)
    {
        this._model = model;
    }

    /**
     * Get model.
     * @returns {T} The model.
     */
    get model(): T
    {
        return this._model;
    }
}

/**
 * @class
 * A class representign a wix-data query.
 */
export class Query<T extends AbstractModel<T>>
{
    private _model: T;
    private _query: any;

    /**
     * Create a Query.
     * @param {T} model The model this query is for. 
     */
    constructor(model: T)
    {
        this.model = model;
        this.query = wixData.query(model.tableName);
    }

    /**
     * Set a filter for the query. Match only those items, that have the given value in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {any} propertyValue The expected value of the property.
     * @returns {this} This query.
     */
    eq(propertyName: string, proeprtyValue: any): this
    {
        this.query = this.query.eq(propertyName, proeprtyValue);
        return this;
    }

    /**
     * Set a filter for the query. Match only those items, that have one of the given values in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {any} propertyValues The possible propertyValues.
     * @returns {this} This query.
     */
    hasSome(propertyName: string, propertyValues: List<any>): this
    {
        this.query = this.query.hasSome(propertyName, propertyValues.toArray());
        return this;
    }

    /**
     * Execute this query and return its result limited by the given limit.
     * @param {number} limit The maximum number of items returned by this query. 
     * @returns {QueryResult<T>} The query result.
     */
    async execute(limit: number=1000): Promise<QueryResult<T>>
    {
        let wixQueryResult = await this.query.limit(limit).find();
        return wixQueryItemsToQueryResult(wixQueryResult, this.model);
    }

    /**
     * Get the wix-data query object.
     * @returns {any} The wuery.
     */
    private get query()
    {
        return this._query;
    }

    /**
     * Set the wix-data query object.
     * @param {any} query The wuery.
     */
    private set query(query)
    {
        this._query = query;
    }

    /**
     * Get the model representing the model of the items returned by this query.
     * @returns {T} The model.
     */
    private get model()
    {
        return this._model;
    }

    /**
     * Set the model representing the model of the items returned by this query.
     * @param {T} model The model.
     */
    private set model(model: T)
    {
        this._model = model;
    }
}

/**
 * Transform items returned by wix-data into a valid QueryResult.
 * @param {Array<object>} items The items to be transformed.
 * @param {U} model The model of the items to be returned.
 * @returns {QueryResult<U>} The QueryResult. 
 */
function wixQueryItemToModel<U extends AbstractModel<U>>(item: object, model: U): U
{
    return model.create(item);
}

/**
 * Transform items returned by wix-data into a valid QueryResult.
 * @param {Array<object>} items The items to be transformed.
 * @param {U} model The model of the items to be returned.
 * @returns {QueryResult<U>} The QueryResult. 
 */
function wixQueryItemsToQueryResult<U extends AbstractModel<U>>(items: Array<object>, model: U): QueryResult<U>
{
    let result = new QueryResult<U>();
    items.forEach((item) => { result.add(wixQueryItemToModel(item, model)); });
    return result;
}

export default WixDatabase;