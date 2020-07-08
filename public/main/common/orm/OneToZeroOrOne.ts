import AbstractModel from "./AbstractModel";
import BHoldsReferenceToA from "./BHoldsReferenceToA";

class OneToZeroOrOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends BHoldsReferenceToA<A,B>
{   
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): OneToZeroOrOne<B,A>
    {
        return new OneToZeroOrOne(this.relativeB, this.relativeA);
    }
}

export default OneToZeroOrOne;