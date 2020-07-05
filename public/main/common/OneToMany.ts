import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "public/main/common/QueryResult";
import List from "public/main/common/util/collections/list/List";


class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: A, relativeB: B)
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
    

    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        let query = this.queryOfRelativeB();
        query = query.hasSome(this.relativeB.asFk(), previousQueryResult.toPks());
        
        return await query.execute();
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

export default OneToMany;