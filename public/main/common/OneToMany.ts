const PATH = "public/main/common/OneToMany.js";

import BHoldsReferenceToA from "public/main/common/BHoldsReferenceToA.js"
import AbstractModel from "public/main/common/AbstractModel.js"

class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends BHoldsReferenceToA<A,B>
{
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): OneToMany<B,A>
    {
        return new OneToMany(this.relativeB, this.relativeA);
    }
}

export default OneToMany;