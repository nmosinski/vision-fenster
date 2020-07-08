import BHoldsReferenceToA from "public/main/common/BHoldsReferenceToA.js"
import AbstractModel from "public/main/common/AbstractModel.js"

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