import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import Set from "./util/collections/set/Set.js";
import QueryResult from "./QueryResult";
import List from "./util/collections/list/List.js";


class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
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
        let prevFks: Set<string> = new Set<string>();
        previousQueryResult.all().foreach((entity) => {prevFks.add(entity[this.relativeB.asFk()]);});
        query = query.hasSome(this.relativeB.asPk(), prevFks);
        
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

export default ManyToOne;