import AbstractModel from "./AbstractModel";
import BHoldsNoReferenceToA from "./BHoldsNoReferenceToA";

class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends BHoldsNoReferenceToA<A,B>
{
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): ManyToOne<B,A>
    {
        return new ManyToOne(this.relativeB, this.relativeA);
    }
}

export default ManyToOne;