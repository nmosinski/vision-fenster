import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "public/main/common/QueryResult.js";
import {Query} from "public/main/common/WixDatabase.js"
import WixDatabase from "public/main/common/WixDatabase.js"
import List from "public/main/common/util/collections/list/List.js";

abstract class Relation<A extends AbstractModel<A>, B extends AbstractModel<B>>
{
    _relativeA: A;
    _relativeB: B;
    _queryResult: QueryResult<B>;
    
    constructor(relativeA: A, relativeB: B)
    {
        this.relativeA = relativeA;
        this.relativeB = relativeB;
        this.queryResult = null;
    }

    async abstract relationalGet(previousQueryResult: QueryResult<A>): Promise<B>;
    async abstract relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void>;
    async abstract relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void>;
    async abstract relationalDestroy(toDestroy: B, previousQueryResult: QueryResult<A>): Promise<void>;

    async abstract relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>;
    async abstract relationalSaveMultiple(toSave: List<B>, previousQueryResult: QueryResult<A>): Promise<void>;
    async abstract relationalUpdateMultiple(toUpdate: List<B>, previousQueryResult: QueryResult<A>): Promise<void>;
    async abstract relationalDestroyMultiple(toDestroy: List<B>, previousQueryResult: QueryResult<A>): Promise<void>;

    queryOfRelativeA(): Query<A>
    {
        return WixDatabase.query(this.relativeA);
    }

    queryOfRelativeB(): Query<B>
    {
        return WixDatabase.query(this.relativeB);
    }

    get relativeA(): A
    {
        return this._relativeA;
    }

    get relativeB(): B
    {
        return this._relativeB;
    }

    get queryResult(): QueryResult<B>
    {
        return this._queryResult;
    }

    set relativeA(relative: A)
    {
        this._relativeA = relative;
    }

    set relativeB(relative: B)
    {
        this._relativeB = relative;
    }


    set queryResult(queryResult: QueryResult<B>)
    {
        this._queryResult = queryResult;
    }
}

export default Relation;