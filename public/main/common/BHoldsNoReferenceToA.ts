const PATH = "public/main/common/BHoldsNoReferenceToA.js";

import Relation from "public/main/common/Relation.js";
import AbstractModel from "public/main/common/AbstractModel.js";
import List from "public/main/common/util/collections/list/List.js";
import Set from "public/main/common/util/collections/set/Set.js";
import QueryResult from "public/main/common/QueryResult.js";
import NotImplementedError from "public/main/common/util/error/NotImplementedError";

abstract class BHoldsNoReferenceToA<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    assign(toBeAssigned: B, relative: A): B 
    {
        // Nothing to do.
        return toBeAssigned;
    }

    assignMultiple(toBeAssigned: List<B>, relative: A): List<B> 
    {
        // Nothing to do.
        return toBeAssigned;
    }

    async relationalGet(relative: A): Promise<B> {
        return (await this.relationalFind(new List([relative]))).first();
    }

    async relationalStore(toStore: B, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }
    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }
    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }

    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> 
    {
        let asToDestroy: List<A>;
        
        if(!relatives)
            asToDestroy = await this.queryOfRelativeA().eq(toDestroy.asFk(), toDestroy.pk).execute();
        else
        {
            asToDestroy = relatives.filter((a)=> { return a[toDestroy.asFk()] === toDestroy.pk; });
        }

        await AbstractModel.destroyMultiple(asToDestroy);
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> 
    {
        if(relatives.isEmpty())
            return new QueryResult<B>();

        let aRelativeB = new this.relativeB();
        let bQuery = this.queryOfRelativeB();
        let toFindIds: Set<string> = new Set<string>(relatives.splitProperty<string>(aRelativeB.asFk()).toArray());

        bQuery = bQuery.hasSome(aRelativeB.asPk(), toFindIds);
        
        return await bQuery.execute();
    }

    async relationalStoreMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }
    async relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }
    async relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> 
    {
        // Nothing to do.
    }
    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> 
    {
        let asToDestroy = new List<A>();
        let bInstance = new this.relativeB();

        if(!relatives)
            asToDestroy = await this.queryOfRelativeA().hasSome(bInstance.asFk(), toDestroy.splitProperty<string>("pk")).execute();
        else
            asToDestroy = relatives.filter((a)=> { return toDestroy.toArray().includes(a[bInstance.asFk()]); });

        await AbstractModel.destroyMultiple(asToDestroy);
    }
    
}

export default BHoldsNoReferenceToA;