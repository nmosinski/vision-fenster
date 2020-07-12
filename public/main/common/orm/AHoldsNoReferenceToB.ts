import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";

const PATH = "public/main/common/orm/AHoldsNoReferenceToB.js";


/**
 * @todo
 */
abstract class AHoldsNoReferenceToB<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A,B>
{
    assign(toBeAssigned: B, relative: A): B 
    {
        toBeAssigned[relative.asFk()] = relative.id;
      
        return toBeAssigned;
    }

    assignMultiple(toBeAssigned: List<B>, relative: A): List<B> 
    {
        toBeAssigned.foreach((b)=>{this.assign(b, relative);});
        return toBeAssigned;
    }

    async relationalGet(relative: A): Promise<B> 
    {
        return (await this.queryOfRelativeB().eq(relative.asFk(), relative.id).execute(1)).first();
    }

    async relationalCreate(toCreate: B, relatives?: List<A>): Promise<void> 
    {
        
    }

    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> 
    {
        await this.relationalCreate(toSave, relatives);
    }

    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> 
    {
        await this.relationalCreate(toUpdate, relatives);
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

        query = query.hasSome(AbstractModel.asFk(this.relativeA), relatives.splitProperty<string>("id"));
        
        let result = await query.execute();
   
        return result;
    }

    async relationalCreateMultiple(toCreate: List<B>, relatives?: List<A>): Promise<void> 
    {
        
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

export default AHoldsNoReferenceToB;