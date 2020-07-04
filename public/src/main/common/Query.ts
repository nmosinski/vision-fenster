import AbstractModel from "./AbstractModel";
import wixData from "wix-data";
import QueryResult from "./QueryResult";
import List from "./util/collections/list/List";

/**
 * Cabsule this.
 * THEN: AbstractModel holds only the PreviousQueryElement. Depending on that, it will perform CRUD-operations softly different.
 * For each kind of Relationship there is a Class. It performs the CRUD-Operation depending on the relation.
 * CRUD in QueryElement (parent) performs the operation that a root would normally do at the end of the function.
 */

class Query<T extends AbstractModel<T>>
{
    private _model: T;
    private _query: any;

    constructor(model: T)
    {
        this.model = model;
        this.query = wixData.query(model.tableName);
    }

    eq(columnName: string, columnValue: any): this
    {
        this.query = this.query.eq(columnName, columnValue);
        return this;
    }

    hasSome(propertyName: string, propertyValues: List<any>): this
    {
        this.query = this.query.hasSome(propertyName, propertyValues.toArray());
        return this;
    }

    async execute(limit: number=1000): Promise<QueryResult<T>>
    {
        let wixQueryResult = await this.query.limit(limit).find();
        return this.wixQueryItemsToQueryResult(wixQueryResult);
    }

    private wixQueryItemsToQueryResult(items: Array<object>): QueryResult<T>
    {
        let result = new QueryResult<T>();
        items.forEach((item, index) => { result.add(this.model.create(item)); });
        return result;
    }

    private get query()
    {
        return this._query;
    }

    private set query(query)
    {
        this._query = query;
    }

    private get model()
    {
        return this._model;
    }

    private set model(model: T)
    {
        this._model = model;
    }
}

export default Query;
