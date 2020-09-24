import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import Set from "../util/collections/set/Set";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";
import { AnyNumber } from "../util/supportive";

const PATH = "public/main/common/orm/AHoldsReferenceToB.js";


abstract class AHoldsReferenceToB<A extends AbstractModel<A>, B extends AbstractModel<B>> extends NotManyToMany<A, B>
{
    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>
    {
        const asList: List<A> = new List<A>(as);
        const b: B = new List<B>(bs).first();

        asList.foreach((a: A) =>
        {
            a[this.bAsFkForA()] = b.id;
        });

        await AbstractModel.update(asList, this.bAsFkForA());
    }

    async relationalGet(relative: A): Promise<B | never>
    {
        return await AbstractModel.get(relative[this.bAsFkForA()], this.relativeB);
    }

    async relationalDestroy(relatives: AnyNumber<A>): Promise<void>
    {
        // Nothing to do
    }

    areRelated(a: A, b: B): boolean
    {
        if (a[this.bAsFkForA()] === b.id)
            return true;
        return false;
    }

    async relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>>
    {
        const relativesList = new QueryResult(relatives);
        if (relativesList.isEmpty())
            return new QueryResult();
        const aRelativeB = new this.relativeB();
        let bQuery = this.queryOfRelativeB();
        const toFindIds: Set<string> = new Set<string>(relativesList.reduce(this.bAsFkForA()));
        bQuery = bQuery.hasSome("_id", toFindIds);

        return await bQuery.execute();
    }
}

export default AHoldsReferenceToB;