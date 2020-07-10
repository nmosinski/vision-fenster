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
        // Nothing to do. Associate and create shold be a separate function.

        /*
        // Check if the A that B belongs to is contained in the given relatives.
        if(relatives)
            relatives.foreach((a)=>{
                if(a.id === toCreate[a.asFk()])
                    return;
            });

        // Try to find the relative in the storage.
        let a = new this.relativeA();
        a.id = toCreate[a.asFk()];
        a = await a.load(toCreate[a.asFk()]);
        if(a)
            return;
        
        // Try to create a default A for B.
        if(a.valid())
            await a.create();
        
        // B can't be saved due to the missing relative.
        throw new CreateError(PATH, "OneToMany.relationalCreate()", toCreate);
        */
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
        query = query.hasSome(new this.relativeA().asFk(), relatives.splitProperty<string>("id"));
        
        return await query.execute();
    }

    async relationalCreateMultiple(toCreate: List<B>, relatives?: List<A>): Promise<void> 
    {
        /*
        // Check if the A that B belongs to is contained in the given relatives.
        let bsWithoutAs = new List<B>();

        if(relatives)
        {            
            toCreate.foreach((b)=>{
                let found = false;

                relatives.foreach((a)=>{
                    if(a.id === toCreate[a.asFk()])
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
        a.id = toCreate[a.asFk()];
        a = await a.load(toCreate[a.asFk()]);
        if(a)
            return;
        
        // Try to create a default A for B.
        if(a.valid())
            await a.create();
        
        // B can't be saved due to the missing relative.
        throw new CreateError(PATH, "OneToMany.relationalCreate()", toCreate);
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

export default AHoldsNoReferenceToB;