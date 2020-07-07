const PATH = "public/main/common/OneToMany.js";

import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import StoreError from "public/main/common/StoreError.js"
import QueryResult from "public/main/common/QueryResult.js";
import List from "public/main/common/util/collections/list/List.js";


class OneToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    constructor(relativeA: new()=>A, relativeB: new()=>B)
    {
        super(relativeA, relativeB);
    }

    inverse(): OneToMany<B,A>
    {
        return new OneToMany(this.relativeB, this.relativeA);
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

    /**
     * @override
     * @inheritdoc
     * @throws {StoreError} If couldn't be stored because of missing relative. 
     */
    async relationalStore(toStore: B, relatives?: List<A>): Promise<void> 
    {
        // Check if the A that B belongs to is contained in the given relatives.
        if(relatives)
            relatives.foreach((a)=>{
                if(a.pk === toStore[a.asFk()])
                    return;
            });

        // Try to find the relative in the storage.
        let a = new this.relativeA();
        a.pk = toStore[a.asFk()];
        a = await a.load(toStore[a.asFk()]);
        if(a)
            return;
        
        // Try to create a default A for B.
        if(a.valid())
            await a.save();
        
        // B can't be saved due to the missing relative.
        throw new StoreError(PATH, "OneToMany.relationalStore()", toStore);
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
        else
            relatives = new QueryResult<A>(relatives);

        let query = this.queryOfRelativeB();
        query = query.hasSome(new this.relativeB().asFk(), (<QueryResult<A>>relatives).toPks());
        
        return await query.execute();
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

export default OneToMany;