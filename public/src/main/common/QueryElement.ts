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

    protected async abstract relationalFind<U extends AbstractModel<U>>(previousQueryResult: QueryResult<AbstractModel<U>>): Promise<List<T>>;

    async abstract relationalSave<U extends AbstractModel<U>>(toSave: List<AbstractModel<T>>, previousQueryResult: QueryResult<U>): Promise<List<U>>;
    async abstract relationalUpdate<U extends AbstractModel<U>>(toUpdate: List<AbstractModel<T>>, previousQueryResult: QueryResult<U>): Promise<List<U>>;
    async abstract relationalDestroy<U extends AbstractModel<U>>(toDestroy: List<AbstractModel<T>>, previousQueryResult: QueryResult<U>): Promise<List<U>>;

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

    async saveMany(toSave: List<T>): Promise<void>
    {
        /*
        let previousQueryResult = await this.previous.find();
        let toUpdate = await this.relationalSave(toSave, previousQueryResult);

        await this.previous.updateMany(toUpdate);
        await this.previousQueryElementOfThisModel().saveMany(toSave);
        */
    }

    async updateMany(toUpdate: List<T>): Promise<void>
    {
        // update the given objects considering the relation to previous. Means, update the fks in this objects in necessary.
        // Call root?


        // Is pretended to be executed only if the list of items should be assigned to the previous query result.
        // Each model should hold all of his relations. Update/ UpdateMany should always consider all relations, going on recursive.
        // Update ids in toUpdate-Models. Update ids in models retrieved by this find-query if necessary. Call toUpdate for previous.
        /*
        let previousQueryResult = await this.previous.find();
        let toUpdate = await this.relationalUpdate(toUpdate, previousQueryResult);

        await this.previous.updateMany(toUpdate);
        await this.previousQueryElementOfThisModel().saveMany(toSave);
        */
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

    rootQueryElement<U extends AbstractModel<U>>(): Root<U>
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