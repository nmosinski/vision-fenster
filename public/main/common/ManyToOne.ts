import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import Set from "public/main/common/util/collections/set/Set.js";
import QueryResult from "public/main/common/QueryResult.js";
import List from "public/main/common/util/collections/list/List.js";


class ManyToOne<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): ManyToOne<B,A>
    {
        return new ManyToOne(this.relativeB, this.relativeA);
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
    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async relationalFind(relatives?: List<A>): Promise<QueryResult<B>> 
    {
        if(!relatives)
            relatives = await this.queryOfRelativeA().execute();
        let relativeB = new this.relativeB();
        let query = this.queryOfRelativeB();
        let prevFks: Set<string> = new Set<string>();
        relatives.foreach((entity) => {prevFks.add(entity[relativeB.asFk()]);});
        query = query.hasSome(relativeB.asPk(), prevFks);
        
        return await query.execute();
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

export default ManyToOne;