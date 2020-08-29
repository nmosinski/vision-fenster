import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import Relation from "./Relation";
import NotImplementedError from "../util/error/NotImplementedError";
const PATH = "public/main/common/orm/ManyToMany"


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

    assign(bs: B | List<B>, as: A | List<A>): void {
        throw new NotImplementedError(PATH, "assign");
        /**
        let asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        let bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        asList.foreach((a: A) => {
            let related = new QueryResult<B>();
            bsList.foreach((b: B) => {
                if (this.areRelated(a, b, roles))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });

        bsList.foreach((b: B) => {
            let related = new QueryResult<A>();
            asList.foreach((a: A) => {
                if (this.areRelated(a, b, roles))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });
        */
    }

    link(bs: B | List<B>, as: A | List<A>): void {
        throw new NotImplementedError(PATH, "link");
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