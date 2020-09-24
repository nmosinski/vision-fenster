import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";
import List from "../util/collections/list/List";
import OneToMany from "./OneToMany";
import QueryResult from "./QueryResult";

class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsReferenceToB<A, B>
{
    constructor (relativeA: new () => A, relativeB: new () => B, aAsPropertyNameForB: string | null = null)
    {
        super(relativeA, relativeB, (aAsPropertyNameForB) ? aAsPropertyNameForB : AbstractModel.asMultiplePropertyName(relativeA));
    }

    async link(bs: B | List<B>, as: A | List<A>): Promise<void>
    {
        const asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        const bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        asList.foreach((a: A) =>
        {
            const related = new QueryResult<B>();
            bsList.foreach((b: B) =>
            {
                if (this.areRelated(a, b))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA] = related.firstOrNull();
        });

        bsList.foreach((b: B) =>
        {
            const related = new QueryResult<A>();
            asList.foreach((a: A) =>
            {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB] = related;
        });
    }

    inverse(): OneToMany<B, A>
    {
        return (new this.relativeA()).getRelation(this.relativeB) as OneToMany<B, A>;

    }
}

export default ManyToOne;