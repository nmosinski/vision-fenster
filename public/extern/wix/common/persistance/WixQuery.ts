import List from "../../../../main/common/util/collections/list/List";
import { AnyNumber } from "../../../../main/common/util/supportive";
// @ts-ignore
import wixData from "wix-data";

/**
 * @class
 * A class representing a wix-data query.
 */
export class Query
{
    private _query: any;

    /**
     * Create a Query.
     * @param {string} tableName The name of the table this query is for. 
     */
    constructor (tableName: string)
    {
        this.query = wixData.query(tableName);
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
     * @param {List<Number|String|Date>} propertyValues The possible propertyValues.
     * @returns {this} This query.
     */
    hasSome(propertyName: string, propertyValues: AnyNumber<number | string | Date>): this
    {
        const propertyValuesList = new List<number | string | Date>(propertyValues);

        this.query = this.query.hasSome(propertyName, propertyValuesList.toArray());
        return this;
    }

    /**
     * Execute this query and return its result limited by the given limit.
     * @param {number} limit The maximum number of items returned by this query. 
     * @returns {List<object>} The query result.
     */
    async execute(limit: number = 1000): Promise<List<object>>
    {
        return await this.query.limit(limit).find();
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
}