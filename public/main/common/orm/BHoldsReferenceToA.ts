const PATH = "public/main/common/orm/BHoldsReferenceToA.js";

import Relation from "public/main/common/orm/Relation.js";
import AbstractModel from "public/main/common/orm/AbstractModel.js";
import List from "public/main/common/util/collections/list/List.js";
import StoreError from "public/main/common/orm/StoreError.js";
import QueryResult from "public/main/common/orm/QueryResult.js";
import NotImplementedError from "public/main/common/util/error/NotImplementedError";

/**
 * @todo
 */
abstract class BHoldsReferenceToA<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    assign(toBeAssigned: B, relative: A): B 
    {
        toBeAssigned[relative.asFk()] = relative.pk;
        return toBeAssigned;
    }

    assignMultiple(toBeAssigned: List<B>, relative: A): List<B> 
    {
        toBeAssigned.foreach((b)=>{this.assign(b, relative);});
        return toBeAssigned;
    }

    async relationalGet(relative: A): Promise<B> 
    {
        return (await this.queryOfRelativeB().eq(relative.asFk(), relative.pk).execute(1)).first();
    }

    async relationalStore(toStore: B, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do. Associate and create shold be a separate function.

        /*
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
            await a.store();
        
        // B can't be saved due to the missing relative.
        throw new StoreError(PATH, "OneToMany.relationalStore()", toStore);
        */
    }

    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> 
    {
        await this.relationalStore(toSave, relatives);
    }

    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> 
    {
        await this.relationalStore(toUpdate, relatives);
    }
    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> 
    {
        if(relatives.isEmpty())
            return new QueryResult<B>();

        let query = this.queryOfRelativeB();
        query = query.hasSome(new this.relativeA().asFk(), relatives.splitProperty<string>("pk"));
        
        return await query.execute();
    }

    async relationalStoreMultiple(toStore: List<B>, relatives?: List<A>): Promise<void> 
    {
        /*
        // Check if the A that B belongs to is contained in the given relatives.
        let bsWithoutAs = new List<B>();

        if(relatives)
        {            
            toStore.foreach((b)=>{
                let found = false;

                relatives.foreach((a)=>{
                    if(a.pk === toStore[a.asFk()])
                        found = true;
                });
                if(!found)
                    bsWithoutAs.add(b);
            });
        }

        if(bsWithoutAs.isEmpty())
            return;

        let aAsFk = (new this.relativeA()).asFk();
        let idsOfMissingAs = new List<string>();
        bsWithoutAs.foreach((b)=>{idsOfMissingAs.add(b[aAsFk]);});

        // Try to find the missing relatives in the storage.
        let aQuery = this.queryOfRelativeA().hasSome("");
        let a = new this.relativeA();
        a.pk = toStore[a.asFk()];
        a = await a.load(toStore[a.asFk()]);
        if(a)
            return;
        
        // Try to create a default A for B.
        if(a.valid())
            await a.store();
        
        // B can't be saved due to the missing relative.
        throw new StoreError(PATH, "OneToMany.relationalStore()", toStore);
        */
    }

    async relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        // throw new Error("Method not implemented.");
    }
    async relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> {
        // throw new Error("Method not implemented.");
    }
    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> 
    {
        // Nothingto do.    
    }
}

export default BHoldsReferenceToA;