import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import AHoldsNoReferenceToB from "./AHoldsNoReferenceToB";
import Relation from "./Relation";



class ManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A, B>
{
    private _roleModel: new () => AbstractModel<any>;

    constructor(relativeA: new () => A, relativeB: new () => B, roleModel: new () => AbstractModel<any>) {
        super(relativeA, relativeB);
        this.roleModel = roleModel;
    }

    inverse(): ManyToMany<B, A> {
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

    areRelated(a: A, b: B, cs: List<AbstractModel<any>>): boolean {
        let ret = false;
        cs.foreach((c: AbstractModel<any>) => {
            if (c[a.asFk()] === a.id && c[b.asFk()] === b.id)
                ret = true;
        });


        return ret;
    }

    async relationalLoad(relatives: List<A>): Promise<QueryResult<B>> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        let roles = await this.getRoles(relatives);
        let bs = await roleToB.relationalFind(roles);
        relatives.foreach((a: A) => {
            let related = new QueryResult<B>();
            bs.foreach((b: B) => {
                if (this.areRelated(a, b, roles))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });

        bs.foreach((b: B) => {
            let related = new QueryResult<A>();
            relatives.foreach((a: A) => {
                if (this.areRelated(a, b, roles))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });


        return bs;
    }

    private async getRoles(relatives: List<A>): Promise<QueryResult<AbstractModel<any>>> {
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

    set roleModel(roleModel: new () => AbstractModel<any>) {
        this._roleModel = roleModel;
    }

    get roleModel(): new () => AbstractModel<any> {
        return this._roleModel;
    }
}

export default ManyToMany;