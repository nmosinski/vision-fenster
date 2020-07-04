import QueryElement from "public/src/main/common/QueryElement.js"
import AbstractModel from "public/src/main/common/AbstractModel.js"
import List from "./util/collections/list/List";
import QueryResult from "./QueryResult";


class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends QueryElement<A,B>
{
    constructor(memberA: A, memberB: B, previous: QueryElement<AbstractModel<any>,A>=null)
    {
        super(memberA, memberB, previous);
    }

    async relationalDestroy(toDestroy: B): Promise<void>
    {
        // Nothing to do.
    }

    protected async relationalFind(previousQueryResult: QueryResult<A>): Promise<QueryResult<B>>
    {
        let query = this.queryOfMemberB();
        query = query.hasSome(this.previous.memberB.asFk(), previousQueryResult.toPks());
        
        return await query.find();
    }

    /*

    relationalSave(model: AbstractModel<T>): Promise<void> 
    {
        model.pk = this.rootQueryElement().memberB.pk;
        this.previousQueryElementOfThisModel().relationalSave(model);
    }
    update(model: AbstractModel<T>): Promise<void> 
    {
        model.pk = this.rootQueryElement().memberB.pk;
        this.previousQueryElementOfThisModel().update(model);
    }
    destroy(model: AbstractModel<T>): Promise<void>
    {
        model.pk = this.rootQueryElement().memberB.pk;
        this.previousQueryElementOfThisModel().destroy(model);
    }
    */
}

export default OneToMany;