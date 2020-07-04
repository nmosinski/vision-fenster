import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "./QueryResult";

class OneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: A, relativeB: B)
    {
        super(relativeA, relativeB);
    }

    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        let query = this.queryOfRelativeB();
        query = query.hasSome(this.relativeA.asFk(), previousQueryResult.toPks());
        
        return await query.execute();
    }

    relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalDestroy(toDestroy: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }  
}

export default OneToOne;