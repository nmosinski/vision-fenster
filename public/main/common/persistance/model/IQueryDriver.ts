import List from "../../util/collections/list/List";
import { AnyNumber } from "../../util/supportive";

interface IQueryDriver
{
    /**
     * Set a filter for the query. Match only those items, that have the given value in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {any} propertyValue The expected value of the property.
     * @returns {this} This query.
     */
    eq(propertyName: string, proeprtyValue: any): this;

    /**
     * Set a filter for the query. Match only those items, that have one of the given values in the property of the given property name.
     * @param {string} propertyName The name of the property. 
     * @param {AnyNumber<Number|String|Date>} propertyValues The possible propertyValues.
     * @returns {this} This query.
     */
    hasSome(propertyName: string, propertyValues: AnyNumber<any>): this;

    /**
     * Execute this query and return its result limited by the given limit.
     * @returns {List<{id: string}>} The query result.
     */
    execute(): Promise<List<{ [x: string]: any; id?: string; }>>;

    /**
     * Limit the number of items retrieved by the query.
     * @param {number} limit the limit.
     * @returns {this} this.
     */
    limit(limit: number): this;
}

export default IQueryDriver;