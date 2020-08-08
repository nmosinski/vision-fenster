import AbstractModel from "./AbstractModel";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";

class OneToZeroOrOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsNoReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    inverse(): OneToZeroOrOne<B, A> {
        return new OneToZeroOrOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asSinglePropertyName(this.relativeB);
    }
}

export default OneToZeroOrOne;