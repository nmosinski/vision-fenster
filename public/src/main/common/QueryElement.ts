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
    }

    protected abstract buildQuery(previousQueryResult: QueryResult<AbstractModel<any>>);

    async abstract save(model: AbstractModel<T>): Promise<void>;
    async abstract update(model: AbstractModel<T>): Promise<void>;
    async abstract destroy(model: AbstractModel<T>): Promise<void>;

    async resolve(): Promise<QueryResult<T>>
    {
        let previousQueryResult = await this.previous.resolve();
        if(previousQueryResult.isEmpty())
        {
            this.queryResult = new QueryResult<T>();    
            return this.queryResult;
        }

        let query = this.buildQuery(previousQueryResult);
        
        this.queryResult =  await this.execQuery(query);
        return this.queryResult;
    }

    async execQuery(query): Promise<QueryResult<T>>
    {
        let result = new QueryResult<T>();
        let wixDataQueryResult = await query.find();
        let items = new List<any>(wixDataQueryResult.items);
        
        items.foreach((item)=>{
            let m = this.model.newInstance();
            m.fill(item);
            result.add(m);
        });

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