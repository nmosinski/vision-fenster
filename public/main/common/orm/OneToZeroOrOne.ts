import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import ZeroOrOneToOne from "./ZeroOrOneToOne";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import AbstractStorableModel from "./AbstractStorableModel";

class OneToZeroOrOne<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>> extends AHoldsNoReferenceToB<A, B>
{
    constructor (relativeA: new () => A, relativeB: new () => B)
    {
        super(relativeA, relativeB);
    }

    async link(bs: B | List<B>, as: A | List<A>): Promise<void>
    {
        const asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        const bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        bsList.foreach((b: B) =>
        {
            const related = new QueryResult<A>();
            asList.foreach((a: A) =>
            {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related.firstOrNull();
        });
    }

    inverse(): ZeroOrOneToOne<B, A>
    {
        return new ZeroOrOneToOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string
    {
        return AbstractStorableModel.asSinglePropertyName(this.relativeB);
    }
}

export default OneToZeroOrOne;