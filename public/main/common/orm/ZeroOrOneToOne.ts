import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";


class ZeroOrOneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    inverse(): ZeroOrOneToOne<B, A> {
        return new ZeroOrOneToOne(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asSinglePropertyName(this.relativeB);
    }
}

export default ZeroOrOneToOne;