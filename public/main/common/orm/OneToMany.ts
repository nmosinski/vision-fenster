import AbstractModel from "./AbstractModel";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import List from "../util/collections/list/List";
import ManyToOne from "./ManyToOne";
import QueryResult from "./QueryResult";

const PATH = "public/main/common/orm/OneToMany.js";

class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsNoReferenceToB<A, B>
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
            a[this.bAsPropertyNameForA()] = related;
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

    inverse(): ManyToOne<B, A> {
        return new ManyToOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asMultiplePropertyName(this.relativeB);
    }
}

export default OneToMany;