import Relation from "public/src/main/common/Relation.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import QueryResult from "./QueryResult";


class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: A, relativeB: B)
    {
        super(relativeA, relativeB);
    }

    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        let query = this.queryOfRelativeB();
        query = query.hasSome(this.relativeB.asFk(), previousQueryResult.toPks());
        
        return await query.execute();
    }

    relationalSave(toSave: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdate(toUpdate: B, previousQueryResult: QueryResult<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async relationalDestroy(toDestroy: B): Promise<void>
    {
        // Nothing to do.
    }
}

export default OneToMany;