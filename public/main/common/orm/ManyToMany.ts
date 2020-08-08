import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import Relation from "./Relation";



class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>, C extends AbstractModel<C>> extends Relation<A, B>
{
    private _roleModel: new () => C;

    constructor(relativeA: new () => A, relativeB: new () => B, roleModel: new () => C) {
        super(relativeA, relativeB);
        this.roleModel = roleModel;
    }

    inverse(): ManyToMany<B, A, C> {
        return new ManyToMany(this.relativeB, this.relativeA, this.roleModel);
    }

    bAsPropertyNameForA(): string {
        return AbstractModel.asMultiplePropertyName(this.relativeB);
    }

    assign(toBeAssigned: B, relative: A): B {
        throw new Error("Method not implemented.");
    }
    assignMultiple(toBeAssigned: List<B>, relative: A): List<B> {
        throw new Error("Method not implemented.");
    }

    relationalCreate(toCreate: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalSave(toSave: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalCreateMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }
    relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async relationalGet(relative: A): Promise<B> {
        let bs = await this.relationalFind(new List<A>([relative]));
        return bs.first();
    }

    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        await roleToB.relationalDestroy(toDestroy);
    }

    areRelated(a: A, b: B, cs: List<C>): boolean {
        let ret = false;
        cs.foreach((c: C) => {
            if (c[a.asFk()] === a.id && c[b.asFk()] === b.id)
                return true;
        });

        return ret;
    }

    async relationalLoad(relatives: List<A>): Promise<List<B>> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        let roles = await this.getRoles(relatives);
        let bs = await roleToB.relationalFind(roles);

        relatives.foreach((a: A) => {
            let related = new List<B>();
            bs.foreach((b: B) => {
                if (this.areRelated(a, b, roles))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });
        return bs;
    }

    private async getRoles(relatives: List<A>): Promise<QueryResult<C>> {
        let aToRole = new OneToMany(this.relativeA, this.roleModel);
        return await aToRole.relationalFind(relatives);
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        return await roleToB.relationalFind(await (this.getRoles(relatives)));
    }

    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        await roleToB.relationalDestroyMultiple(toDestroy);
    }

    set roleModel(roleModel: new () => C) {
        this._roleModel = roleModel;
    }

    get roleModel(): new () => C {
        return this._roleModel;
    }
}

export default ManyToMany;