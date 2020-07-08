import AbstractModel from "./AbstractModel";
import BHoldsNoReferenceToA from "./BHoldsNoReferenceToA";


class ZeroOrOneToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends BHoldsNoReferenceToA<A,B>
{   
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): ZeroOrOneToOne<B,A>
    {
        return new ZeroOrOneToOne(this.relativeB, this.relativeA);
    }
}

export default ZeroOrOneToOne;