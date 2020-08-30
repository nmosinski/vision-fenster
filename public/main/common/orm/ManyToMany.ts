import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import Set from "../util/collections/set/Set";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import Relation from "./Relation";
import NotImplementedError from "../util/error/NotImplementedError";
import { AnyNumber } from "../util/supportive";
import { Query } from "./WixDatabase";
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

    async link(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void> {
        let asList = new List<A>(as);
        let bsList = new List<B>(bs);

        if (asList.isEmpty() || bsList.isEmpty())
            return;
        let roles = await this.getRoles(as);

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
    }

    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void> {
        let asList = new List<A>(as);
        let bsList = new List<B>(bs);

        if (asList.isEmpty() || bsList.isEmpty())
            return;

        let roles = await this.getRoles(as);
        let rolesSet = new Set(roles);
        bsList.foreach((b: B) => {
            asList.foreach((a: A) => {
                let roleModel = new (this.roleModel)();
                let aAsFk = a.asFk();
                let bAsFk = b.asFk();
                roleModel.fill({ aAsFk: a.id, bAsFk: b.id });
                rolesSet.add(roleModel);
            });
        });

        await AbstractModel.save(rolesSet);

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

    async relationalGet(relative: A): Promise<B> {
        let bs = await this.relationalFind(new List<A>([relative]));
        return bs.first();
    }

    async relationalDestroy(relatives?: AnyNumber<A>): Promise<void> {
        let roleToA = new OneToMany(this.relativeA, this.roleModel);
        let roles = await roleToA.relationalFind(relatives);
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        await roleToB.relationalDestroy(roles);
    }

    areRelated(a: A, b: B, roles: AnyNumber<AbstractModel<any>>): boolean {
        let ret = false;
        let rolesList = new List<AbstractModel<any>>(roles);
        rolesList.foreach((role: AbstractModel<any>) => {
            if (role[a.asFk()] === a.id && role[b.asFk()] === b.id)
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

    private async getRoles(relatives: AnyNumber<A>): Promise<QueryResult<AbstractModel<any>>> {
        let relativesList = new List<A>(relatives);
        if (relativesList.isEmpty())
            return new QueryResult<A>();

        let aToRole = new OneToMany(this.relativeA, this.roleModel);
        return await aToRole.relationalFind(relativesList);
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> {
        let roleToB = new ManyToOne(this.roleModel, this.relativeB);
        return await roleToB.relationalFind(await (this.getRoles(relatives)));
    }

    set roleModel(roleModel: new () => AbstractModel<any>) {
        this._roleModel = roleModel;
    }

    get roleModel(): new () => AbstractModel<any> {
        return this._roleModel;
    }
}

export default ManyToMany;