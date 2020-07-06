import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import List from "public/main/common/util/collections/list/List.js";
import QueryResult from "public/main/common/QueryResult.js";

class OneToZeroOrOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{   
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): OneToZeroOrOne<B,A>
    {
        return new OneToZeroOrOne(this.relativeB, this.relativeA);
    }

    assign(toBeAssigned: B, relatives: List<A>): B {
        throw new Error("Method not implemented.");
    }
    assignMultiple(toBeAssigned: List<B>, relatives: List<A>): List<B> {
        throw new Error("Method not implemented.");
    }
    async relationalGet(id: string, relatives?: List<A>): Promise<B> {
        throw new Error("Method not implemented.");
    }
    async relationalStore(toStore: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalFind(relatives?: QueryResult<A>): Promise<QueryResult<B>> {
        throw new Error("Method not implemented.");
    }
    async relationalStoreMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default OneToZeroOrOne;