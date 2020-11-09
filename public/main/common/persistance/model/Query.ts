import List from "../../util/collections/list/List";
import VariableValueError from "../../util/error/VariableValueError";
import { AnyNumber } from "../../util/supportive";
import IQueryDriver from "./IQueryDriver";

const PATH = 'public/main/common/persistance/model/Query';

/**
 * @class
 * A class representing a wix-data query.
 */
export class Query
{
    private _query: IQueryDriver;

    /**
     * Create a Query. 
     */
    constructor (query: IQueryDriver)
    {
        this.query = query;
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
    hasSome(propertyName: string, propertyValues: AnyNumber<any>): this
    {
        this.query = this.query.hasSome(propertyName, propertyValues);
        return this;
    }

    /**
     * Limit the number of items retrieved by the query.
     * @param {number} limit the limit.
     * @returns {this} this.
     */
    limit(limit: number): this
    {
        if (limit < 1)
        {
            throw new VariableValueError(PATH, 'limit', limit, 'A number greater than 0');
        }
        this.query = this.query.limit(limit);
        return this;
    }

    /**
     * Execute this query and return its result limited by the given limit.
     * @returns {QueryResult<T>} The query result.
     */
    async execute(): Promise<List<{ [x: string]: any; id?: string; }>>
    {
        return await this.query.execute();
    }

    /**
     * Get the query.
     * @returns {IQueryDriver} The query.
     */
    private get query(): IQueryDriver
    {
        return this._query;
    }

    /**
     * Set the query.
     * @param {IQueryDriver} query The query.
     */
    private set query(query: IQueryDriver)
    {
        this._query = query;
    }
}