import AbstractModel from "./AbstractModel";
import AHoldsReferenceToB from "./AHoldsReferenceToB";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";


class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>, C extends AbstractModel<C>> extends AHoldsReferenceToB<A,B>
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
    async relationalGet(relative: A): Promise<B> {
        throw new Error("Method not implemented.");
    }
    async relationalCreate(toCreate: B, relatives?: List<A>): Promise<void> {
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
    async relationalCreateMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
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