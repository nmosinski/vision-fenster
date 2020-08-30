import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";
import List from "../util/collections/list/List";
import OneToMany from "./OneToMany";
import QueryResult from "./QueryResult";

class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    async assign(bs: B | List<B>, as: A | List<A>): Promise<void> {
        let asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        let bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        asList.foreach((a: A) => {
            let related = new QueryResult<B>();
            bsList.foreach((b: B) => {
                if (this.areRelated(a, b))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related.firstOrNull();
        });

        bsList.foreach((b: B) => {
            let related = new QueryResult<A>();
            asList.foreach((a: A) => {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });
    }

    inverse(): OneToMany<B, A> {
        return new OneToMany(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asSinglePropertyName(this.relativeB);
    }
}

export default ManyToOne;