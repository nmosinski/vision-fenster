import List from "../util/collections/list/List";
import Set from "../util/collections/set/Set";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";
import { AnyNumber } from "../util/supportive";
import AbstractStorableModel from "./AbstractStorableModel";

const PATH = "public/main/common/orm/AHoldsReferenceToB.js";


abstract class AHoldsReferenceToB<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>> extends NotManyToMany<A, B>
{
    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>
    {
        const asList: List<A> = new List<A>(as);
        const b: B = new List<B>(bs).first();

        asList.foreach((a: A) =>
        {
            a[AbstractStorableModel.asFk(this.relativeB)] = b.id;
        });

        await AbstractStorableModel.update(asList, AbstractStorableModel.asFk(this.relativeB));
    }

    async relationalGet(relative: A): Promise<B | never>
    {
        return await AbstractStorableModel.get(relative[AbstractStorableModel.asFk(this.relativeB)], this.relativeB);
    }

    async relationalDestroy(relatives: AnyNumber<A>): Promise<void>
    {
        // Nothing to do
    }

    areRelated(a: A, b: B): boolean
    {
        if (a[b.asFk()] === b.id)
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
        const toFindIds: Set<string> = new Set<string>(relativesList.pluck(aRelativeB.asFk()));
        bQuery = bQuery.hasSome("_id", toFindIds);

        const result = new QueryResult<B>();
        (await bQuery.execute()).foreach(item => result.add(new this.relativeB(item)));
        return result;
    }
}

export default AHoldsReferenceToB;