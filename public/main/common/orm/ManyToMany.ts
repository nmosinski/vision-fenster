import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";



class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>, C extends AbstractModel<C>> extends AHoldsNoReferenceToB<A,B>
{
    private _roleModel: new()=>C;

    constructor(relativeA: new()=>A, relativeB: new()=>B, roleModel: new()=>C)
    {
        super(relativeA, relativeB);
        this.roleModel = roleModel;
    }

    inverse(): ManyToMany<B,A, C>
    {
        return new ManyToMany(this.relativeB, this.relativeA, this.roleModel);
    }

    assign(toBeAssigned: B, relative: A): B {
        throw new Error("Method not implemented.");
    }
    assignMultiple(toBeAssigned: List<B>, relative: A): List<B> {
        throw new Error("Method not implemented.");
    }

    async relationalGet(relative: A): Promise<B> 
    {
        let bs = await this.relationalFind(new List<A>([relative]));
        return bs.first();
    }
  
    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> 
    {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        await roleToB.relationalDestroy(toDestroy);
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> 
    {
        let aToRole = new OneToMany(this.relativeA, this.roleModel);
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        ////console.log("relatives in relational find many to many");
        ////console.log(relatives);
        let roleResult = await aToRole.relationalFind(relatives);
        ////console.log("role models in relational find many to many");
        ////console.log(roleResult);
        return await roleToB.relationalFind(roleResult);
    }

    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> 
    {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        await roleToB.relationalDestroyMultiple(toDestroy);
    }

    set roleModel(roleModel: new()=>C)
    {
        this._roleModel = roleModel;
    }

    get roleModel(): new()=>C
    {
        return this._roleModel;
    }
}

export default ManyToMany;