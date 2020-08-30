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
    async link(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void> {
        let asList: List<A> = new List<A>(as);
        let b: B = new List<B>(bs).first();

        asList.foreach((a: A) => {
            a[AbstractModel.asFk(this.relativeB)] = b.id;
        });
    }

    async relationalGet(relative: A): Promise<B | never> {
        return await AbstractModel.get(relative[AbstractModel.asFk(this.relativeB)], this.relativeB);
    }

    async relationalDestroy(relatives: AnyNumber<A> = []): Promise<void> {
        // Nothing to do
    }

    areRelated(a: A, b: B): boolean {
        if (a[b.asFk()] === b.id)
            return true;
        return false;
    }

    async relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>> {
        let relativesList = new QueryResult(relatives);
        if (relativesList.isEmpty())
            relativesList = await AbstractModel.find(this.relativeA);

        let aRelativeB = new this.relativeB();
        let bQuery = this.queryOfRelativeB();
        let toFindIds: Set<string> = new Set<string>(relativesList.reduce(aRelativeB.asFk()));
        bQuery = bQuery.hasSome("_id", toFindIds);

        return await bQuery.execute();
    }
}

export default AHoldsReferenceToB;