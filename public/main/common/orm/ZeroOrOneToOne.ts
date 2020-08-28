import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";
import OneToZeroOrOne from "./OneToZeroOrOne";


class ZeroOrOneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsReferenceToB<A, B>
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

export default ZeroOrOneToOne;