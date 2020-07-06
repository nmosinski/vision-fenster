import Relation from "public/main/common/Relation.js"
import AbstractModel from "public/main/common/AbstractModel.js"
import QueryResult from "public/main/common/QueryResult.js";
import OneToMany from "public/main/common/OneToMany.js";
import List from "public/main/common/util/collections/list/List.js";
import ManyToOne from "public/main/common/ManyToOne.js";

class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>, C extends AbstractModel<C>> extends Relation<A,B>
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