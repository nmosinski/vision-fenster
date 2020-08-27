//@ts-ignore
import wixData from "wix-data";
import AbstractModel from "./AbstractModel";
import JsTypes from "../util/jsTypes/JsTypes";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import GetError from "./GetError";

const PATH = "public/main/common/orm/WixDatabase.js";

class WixDatabase<T extends AbstractModel<T>>
{
    private _Model: new () => T;

    constructor(Model: new () => T) {
        this.Model = Model;
    }

    /**
     * Get an item of the given pk.
     * @param {string} pk The pk of the item to be returned.
     * @returns {T} The item of the given pk.
     */
    async get(id: string): Promise<T> {
        return await WixDatabase.get(id, this.Model);
    }

    /**
     * Get an item of the given pk.
     * @param {string} id The pk of the item to be returned.
     * @returns {new()=>U} The item of the given pk.
     */
    static async get<U extends AbstractModel<U>>(id: string, Model: new () => U): Promise<U> {
        let item = await wixData.get(new Model().tableName, id);
        if (!item)
            throw new GetError(PATH, "get", id, Model);
        return itemToModel(item, Model);
    }

    /**
     * Check if an item exists with the given id.
     * @param {string} id The id of the item.
     * @returns {boolean} true if the item exists, else false.
     */
    async has(id: string): Promise<boolean> {
        return await WixDatabase.has(id, this.Model);
    }

    /**
     * Check if an item of the given model exists with the given id.
     * @param {string} id The id of the item.
     * @param {new()=>AbstractModel<any>} Model The model.
     * @returns {boolean} true if the item exists, else false.
     */
    static async has<U extends AbstractModel<U>>(id: string, Model: new () => U): Promise<boolean> {
        let item = await wixData.get(new Model().tableName, id);
        if (!item)
            return false;
        return true;
    }

    /**
     * Get a query.
     * @return {Query<T>} The query.
     */
    query(): Query<T> {
        return WixDatabase.query(this.Model);
    }

    /**
     * Get a query.
     * @param {new()=>U} Model The constructor of the model this query will be for.
     * @return {Query<U>} The query.
     */
    static query<U extends AbstractModel<U>>(Model: new () => U): Query<U> {
        return new Query(Model);
    }

    /**
     * Create an item.
     * @param {T} toCreate The item to be created. 
     */
    async create(toCreate: T): Promise<void> {
        return await WixDatabase.create(toCreate);
    }

    /**
     * Create an item.
     * @param {U} toCreate The item to be created. 
     */
    static async create<U extends AbstractModel<U>>(toCreate: U): Promise<void> {
        await wixData.insert(toCreate.tableName, modelToItem(toCreate));
    }

    /**
     * Save an item.
     * @param {T} toSave The item to be saved. 
     */
    async save(toSave: T): Promise<void> {
        return await WixDatabase.save(toSave);
    }

    /**
     * Save an item.
     * @param {U} toSave The item to be saved. 
     */
    static async save<U extends AbstractModel<U>>(toSave: U): Promise<void> {
        await wixData.save(toSave.tableName, modelToItem(toSave));
    }

    /**
     * Create multiple items.
     * @param {T} toSave The items to be created. 
     */
    async createMultiple(toCreate: List<T>): Promise<void> {
        return await WixDatabase.createMultiple(toCreate);
    }

    /**
     * Create multiple items.
     * @param {U} toCreate The items to be created. 
     */
    static async createMultiple<U extends AbstractModel<U>>(toCreate: List<U>): Promise<void> {
        if (toCreate.isEmpty())
            return;

        await wixData.bulkInsert(toCreate.first().tableName, modelsToItems(toCreate));
    }

    /**
     * Save multiple items.
     * @param {T} toSave The items to be saved. 
     */
    async saveMultiple(toSave: List<T>): Promise<void> {
        return await WixDatabase.saveMultiple(toSave);
    }

    /**
     * Save multiple items.
     * @param {U} toSave The items to be saved. 
     */
    static async saveMultiple<U extends AbstractModel<U>>(toSave: List<U>): Promise<void> {
        if (toSave.isEmpty())
            return;
        await wixData.bulkSave(toSave.first().tableName, modelsToItems(toSave));
    }

    /**
     * Save an item.
     * @param {T} toSave The item to be saved. 
     */
    async update(toUpdate: T): Promise<void> {
        return await WixDatabase.update(toUpdate);
    }

    /**
     * Save an item.
     * @param {U} toSave The item to be saved. 
     */
    static async update<U extends AbstractModel<U>>(toUpdate: U): Promise<void> {
        await wixData.update(toUpdate.tableName, modelToItem(toUpdate));
    }

    /**
     * Update multiple items.
     * @param {T} toUpdate The items to be updated. 
     */
    async updateMultiple(toUpdate: List<T>): Promise<void> {
        return await WixDatabase.updateMultiple(toUpdate);
    }

    /**
     * Update multiple items.
     * @param {U} toUpdate The items to be updated. 
     */
    static async updateMultiple<U extends AbstractModel<U>>(toUpdate: List<U>): Promise<void> {
        if (toUpdate.isEmpty())
            return;
        await wixData.bulkUpdate(toUpdate.first().tableName, modelsToItems(toUpdate));
    }

    /**
     * Remove an item.
     * @param {T} toRemove The item to be removed. 
     */
    async remove(toRemove: T): Promise<void> {
        return await WixDatabase.remove(toRemove);
    }

    /**
     * Remove an item.
     * @param {U} toRemove The item to be removed. 
     */
    static async remove<U extends AbstractModel<U>>(toRemove: U): Promise<void> {
        await wixData.remove(toRemove.tableName, toRemove[itemToModelPropertyMapping("_id")]);
    }

    /**
     * Remove multiple items.
     * @param {List<T>} toRemove The items to be removed. 
     */
    async removeMultiple(toRemove: List<T>): Promise<void> {
        return await WixDatabase.removeMultiple(toRemove);
    }

    /**
     * Remove multiple items.
     * @param {List<U>} toRemove The items to be removed. 
     */
    static async removeMultiple<U extends AbstractModel<U>>(toRemove: List<U>): Promise<void> {
        if (toRemove.isEmpty())
            return;
        let ids: Array<string> = <Array<string>>toRemove.reduce(itemToModelPropertyMapping("_id")).toArray();
        await wixData.bulkRemove(toRemove.first().tableName, ids);
    }

    /**
     * Remove all items from the collection of the model this database has been initiated with.
     */
    async removeAll(): Promise<void> {
        return await WixDatabase.removeAll(this.Model);
    }

    /**
     * Remove all items from the collection of the given model.
     * @param {U extends AbstractModel<u>} Model The model of which the items in its collection will be removed.
     */
    static async removeAll<U extends AbstractModel<U>>(Model: new () => U): Promise<void> {
        return await wixData.truncate((new Model()).tableName);
    }

    /**
     * Set model.
     * @param {new()=>T} model The model to be set.
     */
    set Model(model: new () => T) {
        this._Model = model;
    }

    /**
     * Get model.
     * @returns {new()=>T} The model.
     */
    get Model(): new () => T {
        return this._Model;
    }
}

/**
 * @class
 * A class representign a wix-data query.
 */
export class Query<T extends AbstractModel<T>>
{
    private _model: new () => T;
    //private _subquery: Query<AbstractModel<any>>;
    private _query: any;

    /**
     * Create a Query.
     * @param {new()=>T} Model The model this query is for. 
     */
    constructor(Model: new () => T) {
        this.Model = Model;
        this.query = wixData.query(new Model().tableName);
    }

    /*
    join<U extends AbstractModel<U>>(Model: new()=>U)
    {
        let newQuery = new Query(Model);
        newQuery.subquery = this;
        return newQuery;
    }
    */

    /**
     * Set a filter for the query. Match only those items, that have the given value in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {any} propertyValue The expected value of the property.
     * @returns {this} This query.
     */
    eq(propertyName: string, proeprtyValue: any): this {
        this.query = this.query.eq(modelToItemPropertyMapping(propertyName), proeprtyValue);
        return this;
    }

    /**
     * Set a filter for the query. Match only those items, that have one of the given values in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {List<Number|String|Date>} propertyValues The possible propertyValues.
     * @returns {this} This query.
     */
    hasSome(propertyName: string, propertyValues: List<Number | String | Date>): this {
        this.query = this.query.hasSome(modelToItemPropertyMapping(propertyName), propertyValues.toArray());
        return this;
    }

    /**
     * Execute this query and return its result limited by the given limit.
     * @param {number} limit The maximum number of items returned by this query. 
     * @returns {QueryResult<T>} The query result.
     */
    async execute(limit: number = 1000): Promise<QueryResult<T>> {
        /*
        let previousQueryResult: QueryResult<AbstractModel<any>>;
        if(this.subquery)
            previousQueryResult = await this.subquery.execute();
        */
        let wixQueryResult = await this.query.limit(limit).find();
        return itemsToQueryResult(wixQueryResult.items, this.Model);
    }

    /**
     * Get the wix-data query object.
     * @returns {any} The wuery.
     */
    private get query(): any {
        return this._query;
    }

    /**
     * Set the wix-data query object.
     * @param {any} query The wuery.
     */
    private set query(query: any) {
        this._query = query;
    }

    /*
    private set subquery(subquery: Query<AbstractModel<any>>)
    {
        this._subquery = subquery;
    }
    */

    /**
     * Get the model representing the model of the items returned by this query.
     * @returns {new()=>T} The model.
     */
    private get Model(): new () => T {
        return this._model;
    }

    /**
     * Set the model representing the model of the items returned by this query.
     * @param {new()=>T} model The model.
     */
    private set Model(model: new () => T) {
        this._model = model;
    }

    /*
    private get subquery(): Query<AbstractModel<any>>
    {
        return this._subquery;
    }
    */
}

function itemToModelPropertyMapping(itemPropertyName: string): string {
    if (itemPropertyName === "_id")
        return "id";
    return itemPropertyName;
}

function modelToItemPropertyMapping(modelPropertyName: string): string {
    if (modelPropertyName === "id")
        return "_id";
    return modelPropertyName;
}

function itemToModel<U extends AbstractModel<U>>(item: any, Model: new () => U): U {
    for (let key in item)
        item[itemToModelPropertyMapping(key)] = item[key];

    let model = new Model().fill(item);
    return model;
}

/**
 * Transform items returned by wix-data into a valid QueryResult.
 * @param {Array<object>} items The items to be transformed.
 * @param {new()=>U} model The model of the items to be returned.
 * @returns {QueryResult<U>} The QueryResult. 
 */
function itemsToQueryResult<U extends AbstractModel<U>>(items: Array<object>, Model: new () => U): QueryResult<U> {
    let result = new QueryResult<U>();
    items.forEach((item) => { result.add(itemToModel(item, Model)); });
    return result;
}

function modelToItem(model: AbstractModel<any>): object {
    let stripped = model.strip();
    let item = {};

    for (let key in stripped)
        item[modelToItemPropertyMapping(key)] = stripped[key];

    return item;
}

/**
 * Call strip for each item in the list.
 * @param {List<AbstractModel<any>>}list The list containing the models.
 * @returns {Array<object>} The objects.
 */
function modelsToItems(list: List<AbstractModel<any>>): Array<object> {
    let items: Array<object> = [];
    list.foreach((model) => { items.push(modelToItem(model)); });
    return items;
}

export default WixDatabase;