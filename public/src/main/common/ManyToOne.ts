import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import Set from "./util/collections/set/Set.js";
import OneToOne from "./OneToOne";
import QueryResult from "./QueryResult";
import List from "./util/collections/list/List.js";


class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends QueryElement<A,B>
{
    constructor(memberA: A, memberB: B, previous: QueryElement<AbstractModel<any>, A>=null)
    {
        super(memberA, memberB, previous);
    }

    async relationalDestroy(toDestroy: B): Promise<void>
    {
        // Delete all A's that point to B.
        let as = await this.queryOfMemberA().eq(toDestroy.asFk(), toDestroy.pk).find();
        await this.memberA.destroyMany(this.memberA.)...
        
    }

    protected async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>> 
    {
        let query = this.queryOfMemberB();
        let prevFks: Set<string> = new Set<string>();
        previousQueryResult.all().foreach((entity) => {prevFks.add(entity[this.memberB.asFk()]);});
        query = query.hasSome(this.memberB.asPk(), prevFks);
        
        return await query.find();
    }

    /*
    relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        
    }
    update(model: AbstractModel<T>): Promise<void> 
    {
        // get previous
        // set fks in previous
        // update this -> update()
        // update previous -> updateMany(previous)
    }
    destroy(model: AbstractModel<T>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    */
}

export default ManyToOne;