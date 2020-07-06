//@ts-ignore
import wixData from "wix-data";
import AbstractModel from "public/main/common/AbstractModel.js";
import QueryResult from "public/main/common/QueryResult.js";
import List from "public/main/common/util/collections/list/List.js";


class WixDatabase<T extends AbstractModel<T>>
{
    private _Model: new()=>T;
    
    constructor(Model: new()=>T)
    {
        this.Model = Model;
    }

    /**
     * Get an item of the given id.
     * @param {string} id The id of the item to be returned.
     * @returns {T} The item of the given id.
     */
    async get(id: string): Promise<T>
    {
        return await WixDatabase.get(id, this.Model);
    }

    /**
     * Get an item of the given id.
     * @param {string} id The id of the item to be returned.
     * @returns {new()=>U} The item of the given id.
     */
    static async get<U extends AbstractModel<U>>(id: string, model: new()=>U): Promise<U>
    {
        return wixQueryItemToModel(await wixData.get(new model().tableName, id), model);
    }

    /**
     * Get a query.
     * @return {Query<T>} The query.
     */
    query(): Query<T>
    {
        return WixDatabase.query(this.Model);
    }

    /**
     * Get a query.
     * @param {new()=>U} Model The constructor of the model this query will be for.
     * @return {Query<U>} The query.
     */
    static query<U extends AbstractModel<U>>(Model: new()=>U): Query<U>
    {
        return new Query(Model);
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
        await wixData.save(toSave.tableName, strip(toSave));
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
        wixData.bulkSave(toSave.get(0).tableName, stripMany(toSave));
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
        await wixData.update(toUpdate.tableName, strip(toUpdate));
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
        wixData.bulkUpdate(toUpdate.get(0).tableName, stripMany(toUpdate));
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
     * @param {List<T>} toRemove The items to be removed. 
     */
    async removeMultiple(toRemove: List<T>): Promise<void>
    {
        return await WixDatabase.removeMultiple(toRemove);
    }

    /**
     * Remove multiple items.
     * @param {List<U>} toRemove The items to be removed. 
     */
    static async removeMultiple<U extends AbstractModel<U>>(toRemove: List<U>): Promise<void>
    {
        if(toRemove.isEmpty())
            return;
        let ids: Array<string> = [];
        toRemove.foreach((model)=>{ids.push(model.id)});
        wixData.bulkRemove(toRemove.get(0).tableName, ids);
    }

    /**
     * Set model.
     * @param {new()=>T} model The model to be set.
     */
    set Model(model: new()=>T)
    {
        this._Model = model;
    }

    /**
     * Get model.
     * @returns {new()=>T} The model.
     */
    get Model(): new()=>T
    {
        return this._Model;
    }
}

/**
 * @class
 * A class representign a wix-data query.
 */
export class Query<T extends AbstractModel<T>>
{
    private _model: new()=>T;
    private _query: any;

    /**
     * Create a Query.
     * @param {new()=>T} Model The model this query is for. 
     */
    constructor(Model: new()=>T)
    {
        this.Model = Model;
        this.query = wixData.query(new Model().tableName);
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
        return wixQueryItemsToQueryResult(wixQueryResult, this.Model);
    }

    /**
     * Get the wix-data query object.
     * @returns {any} The wuery.
     */
    private get query(): any
    {
        return this._query;
    }

    /**
     * Set the wix-data query object.
     * @param {any} query The wuery.
     */
    private set query(query: any)
    {
        this._query = query;
    }

    /**
     * Get the model representing the model of the items returned by this query.
     * @returns {new()=>T} The model.
     */
    private get Model(): new()=>T
    {
        return this._model;
    }

    /**
     * Set the model representing the model of the items returned by this query.
     * @param {new()=>T} model The model.
     */
    private set Model(model: new()=>T)
    {
        this._model = model;
    }
}

/**
 * Transform items returned by wix-data into a valid QueryResult.
 * @param {Array<object>} items The items to be transformed.
 * @param {new()=>U} Model The model of the items to be returned.
 * @returns {QueryResult<U>} The QueryResult. 
 */
function wixQueryItemToModel<U extends AbstractModel<U>>(item: object, Model: new()=>U): U
{
    let m = new Model();
    return m.fill(item);
}

/**
 * Transform items returned by wix-data into a valid QueryResult.
 * @param {Array<object>} items The items to be transformed.
 * @param {new()=>U} model The model of the items to be returned.
 * @returns {QueryResult<U>} The QueryResult. 
 */
function wixQueryItemsToQueryResult<U extends AbstractModel<U>>(items: Array<object>, Model: new()=>U): QueryResult<U>
{
    let result = new QueryResult<U>();
    items.forEach((item) => { result.add(wixQueryItemToModel(item, Model)); });
    return result;
}

/**
 * Return an object holding all properties defined for the given model.
 * @param {AbstractModel<any>} model The model to be translated.
 * @returns {object} The object holding the properties defined for the given model.
 */
function strip<U extends AbstractModel<U>>(model: AbstractModel<U>): object
{
    let item = {};
    model.properties.foreach((propertyName)=>{
        item[propertyName] = model[propertyName];
        item["_id"] = model.id;
    });
    return item;
}

/**
 * Call strip for each item in the list.
 * @param list The list containing the models.
 * @returns {Array<object>} The objects.
 */
function stripMany(list)
{
    let stripped = [];
    list.foreach((model)=>{stripped.push(model.strip());});
    return stripped;
}

export default WixDatabase;