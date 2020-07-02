import AbstractModel from "public/src/main/common/AbstractModel.js"
import wixData from "wix-data";
import AbstractEntity from "./AbstractEntity";
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";
import Root from "./Root";


abstract class QueryElement<T extends AbstractModel<T>>
{
    _previous: QueryElement<AbstractModel<any>>;
    _model: T;
    _queryResult: QueryResult<T>;
    
    constructor(model: T, previous: QueryElement<AbstractModel<any>>=null)
    {
        this.model = model;
        this.previous = previous;
        this.queryResult = null;
    }

    protected async abstract relationalFind(previousQueryResult: QueryResult<AbstractModel<any>>);

    async abstract save(model: AbstractModel<T>): Promise<void>;
    async abstract update(model: AbstractModel<T>): Promise<void>;
    async abstract destroy(model: AbstractModel<T>): Promise<void>;

    async find(): Promise<QueryResult<T>>
    {
        // Return result if already resolved before.
        if(this.queryResult)
            return this.queryResult;
  
        // Init this and previous QueryResult.
        this.queryResult = new QueryResult<T>();
        let previousQueryResult = (this.previous)?await this.previous.find():new QueryResult<any>();


        let queryItems = await this.relationalFind(previousQueryResult);
        this.queryResult = this.queryItemsToQueryResult(queryItems);

        return this.queryResult;
    }

    queryItemsToQueryResult(items: List<object>): QueryResult<T>
    {
        let result = new QueryResult<T>();
        items.foreach((item)=>{ result.add(this.model.create(item)); });
        return result;
    }

    previousQueryElementOfThisModel()
    {
        let previous = this.previous;
        while(previous)
        {
            if(previous.model.constructor === this.model.constructor)
                return previous;
            previous = previous.previous;
        }

        return null;
    }

    rootQueryElement(): QueryElement<T>
    {
        let previous = this.previous;
        while(previous)
        {
            if(previous instanceof Root)
                return previous;
            previous = previous.previous;
        }

        return null;
    }

    static queryOnTable(tableName: string)
    {
        return wixData.query(tableName);
    }

    get model()
    {
        return this._model;
    }

    get previous()
    {
        return this._previous;
    }

    get queryResult(): QueryResult<T>
    {
        return this._queryResult;
    }

    set model(model)
    {
        this._model = model;
    }

    set previous(previous)
    {
        this._previous = previous;
    }

    set queryResult(queryResult: QueryResult<T>)
    {
        this._queryResult = queryResult;
    }
}

export default QueryElement;