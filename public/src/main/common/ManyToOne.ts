import Relation from "public/src/main/common/Relation.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import Set from "./util/collections/set/Set.js";
import OneToOne from "./OneToOne";
import QueryResult from "./QueryResult";
import List from "./util/collections/list/List.js";


class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: A, relativeB: B)
    {
        super(relativeA, relativeB);
    }

    async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>> 
    {
        let query = this.queryOfRelativeB();
        let prevFks: Set<string> = new Set<string>();
        previousQueryResult.all().foreach((entity) => {prevFks.add(entity[this.relativeB.asFk()]);});
        query = query.hasSome(this.relativeB.asPk(), prevFks);
        
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

export default ManyToOne;