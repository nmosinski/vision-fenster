import AbstractModel from "./AbstractModel";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import List from "../util/collections/list/List";

const PATH = "public/main/common/orm/OneToMany.js";

class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends AHoldsNoReferenceToB<A, B>
{
    constructor(relativeA: new () => A, relativeB: new () => B) {
        super(relativeA, relativeB);
    }

    inverse(): OneToMany<B, A> {
        return new OneToMany(this.relativeB, this.relativeA);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asMultiplePropertyName(this.relativeB);
    }
}

export default OneToMany;