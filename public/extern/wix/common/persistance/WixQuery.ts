import { AnyNumber } from "../../../../main/common/util/supportive";
// @ts-ignore
import wixData from "wix-data";
import List from "../../../../main/common/util/collections/list/List";
import IQueryDriver from "../../../../main/common/persistance/model/IQueryDriver";
import WixDatabase from "./WixDatabase";
import VariableValueError from "../../../../main/common/util/error/VariableValueError";

const PATH = 'public/extern/wix/common/persistance/WixQuery';

/**
 * @class
 * A class representing a wix-data query.
 */
class WixQuery implements IQueryDriver
{
    private _query: any;
    private _currentLimit: number | null;
    private static MAX_LIMIT = 1000;

    /**
     * Create a Query.
     * @param {string} tableName The name of the table this query is for. 
     */
    constructor (tableName: string)
    {
        this.query = wixData.query(tableName);
        this.currentLimit = null;
    }

    limit(limit: number): this
    {
        this.currentLimit = limit;
        return this;
    }

    /**
     * Set a filter for the query. Match only those items, that have the given value in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {any} propertyValue The expected value of the property.
     * @returns {this} This query.
     */
    eq(propertyName: string, proeprtyValue: any): this
    {
        this.query = this.query.eq((propertyName === 'id') ? '_id' : propertyName, proeprtyValue);
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
        const propertyValuesList = new List<any>(propertyValues);

        this.query = this.query.hasSome((propertyName === 'id') ? '_id' : propertyName, propertyValuesList.toArray());
        return this;
    }

    /**
     * Execute this query and return its result limited by the given limit.
     * @returns {List<{id: string}>} The query result.
     */
    async execute(): Promise<List<{ [x: string]: any; id?: string; }>>
    {
        this.query = this.query.limit((this.currentLimit) ? this.currentLimit : WixQuery.MAX_LIMIT);
        const wixQueryResult = await this.query.find();
        return new List(wixQueryResult.items).map(item => WixDatabase.mapItemToModel(item));
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

    private get currentLimit(): number | null
    {
        return this._currentLimit;
    }

    private set currentLimit(currentLimit: number | null)
    {
        if (typeof (currentLimit) === 'number' && currentLimit < 0)
            throw new VariableValueError(PATH, 'set currentLimit', currentLimit, 'greater than 0');
        this._currentLimit = currentLimit;
    }
}

export default WixQuery;