import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";
import List from "../util/collections/list/List";

class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    inverse(): ManyToOne<B, A> {
        return new ManyToOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asSinglePropertyName(this.relativeB);
    }
}

export default ManyToOne;