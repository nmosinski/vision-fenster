import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import List from "public/main/common/util/collections/list/List.js";
import QueryResult from "public/main/common/QueryResult.js";

class ZeroOrOneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{   
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    async relationalGet(previousQueryResult: QueryResult<A>): Promise<B> {
        throw new Error("Method not implemented.");
    }

    async relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroy(toDestroy: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    

    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>{
        throw new Error("Method not implemented.");
    }

    async relationalSaveMultiple(toSave: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdateMultiple(toUpdate: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroyMultiple(toDestroy: List<B>, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default ZeroOrOneToOne;