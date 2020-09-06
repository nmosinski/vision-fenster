import AbstractModel from "./AbstractModel";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import ZeroOrOneToOne from "./ZeroOrOneToOne";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";

class OneToZeroOrOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsNoReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    async link(bs: B | List<B>, as: A | List<A>): Promise<void> {
        const asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        const bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        asList.foreach((a: A) => {
            const related = new QueryResult<B>();
            bsList.foreach((b: B) => {
                if (this.areRelated(a, b))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related.firstOrNull();
        });

        bsList.foreach((b: B) => {
            const related = new QueryResult<A>();
            asList.foreach((a: A) => {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related.firstOrNull();
        });
    }

    inverse(): ZeroOrOneToOne<B, A> {
        return new ZeroOrOneToOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asSinglePropertyName(this.relativeB);
    }
}

export default OneToZeroOrOne;