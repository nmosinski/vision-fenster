import List from "../util/collections/list/List";
import Set from "../util/collections/set/Set";
import QueryResult from "./QueryResult";
import OneToMany from "./OneToMany";
import ManyToOne from "./ManyToOne";
import Relation from "./Relation";
import { AnyNumber } from "../util/supportive";
import JsTypes from "../util/jsTypes/JsTypes";
import NullPointerException from "../util/error/NullPointerException";
import AbstractStorableModel from "./AbstractStorableModel";
const PATH = "public/main/common/orm/ManyToMany"


class ManyToMany<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>> extends Relation<A, B>
{
    private _roleModel: new () => AbstractStorableModel<any>;

    constructor (relativeA: new () => A, relativeB: new () => B, roleModel: new () => AbstractStorableModel<any>)
    {
        super(relativeA, relativeB);
        this.roleModel = roleModel;
    }

    inverse(): ManyToMany<B, A>
    {
        return new ManyToMany(this.relativeB, this.relativeA, this.roleModel);
    }

    bAsPropertyNameForA(): string
    {
        return AbstractStorableModel.asMultiplePropertyName(this.relativeB);
    }

    async link(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>
    {
        const asList = new List<A>(as);
        const bsList = new List<B>(bs);

        if (asList.isEmpty() || bsList.isEmpty())
            return;
        const roles = await this.getRoles(as);

        bsList.foreach((b: B) =>
        {
            const related = new QueryResult<A>();
            asList.foreach((a: A) =>
            {
                if (this.areRelated(a, b, roles))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });
    }

    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>
    {
        const asList = new List<A>(as);
        const bsList = new List<B>(bs);

        if (asList.isEmpty() || bsList.isEmpty())
            return;

        const roles = await this.getRoles(as);
        const rolesSet = new Set(roles);
        bsList.foreach((b: B) =>
        {
            asList.foreach((a: A) =>
            {
                const roleModel = new (this.roleModel)();
                const aAsFk = a.asFk();
                const bAsFk = b.asFk();
                if (JsTypes.isUnspecified(a.id))
                    throw new NullPointerException(PATH, 'assign', 'Can not assign a model of type A without an id to B.');
                if (JsTypes.isUnspecified(b.id))
                    throw new NullPointerException(PATH, 'assign', 'Can not assign a model of type B without an id to A.');
                const fillData = {};
                fillData[aAsFk] = a.id;
                fillData[bAsFk] = b.id;
                roleModel.fill(fillData);
                rolesSet.add(roleModel);
            });
        });

        await AbstractStorableModel.save(rolesSet);
    }

    async relationalGet(relative: A): Promise<B>
    {
        const bs = await this.relationalFind(new List<A>([relative]));
        return bs.first();
    }

    async relationalDestroy(relatives: AnyNumber<A>): Promise<void>
    {
        const relativesList = new List<A>(relatives);
        return await (await this.getRoles(relativesList)).destroy();
    }

    areRelated(a: A, b: B, roles: AnyNumber<AbstractStorableModel<any>>): boolean
    {
        let ret = false;
        const rolesList = new List<AbstractStorableModel<any>>(roles);
        rolesList.foreach((role: AbstractStorableModel<any>) =>
        {
            if (role[a.asFk()] === a.id && role[b.asFk()] === b.id)
                ret = true;
        });

        return ret;
    }

    async relationalLoad(relatives: List<A>): Promise<QueryResult<B>>
    {
        const roleToB = new ManyToOne(this.roleModel, this.relativeB);
        const roles = await this.getRoles(relatives);
        const bs = await roleToB.relationalFind(roles);
        relatives.foreach((a: A) =>
        {
            const related = new QueryResult<B>();
            bs.foreach((b: B) =>
            {
                if (this.areRelated(a, b, roles))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });

        bs.foreach((b: B) =>
        {
            const related = new QueryResult<A>();
            relatives.foreach((a: A) =>
            {
                if (this.areRelated(a, b, roles))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });


        return bs;
    }

    private async getRoles(relatives: AnyNumber<A>): Promise<QueryResult<AbstractStorableModel<any>>>
    {
        const relativesList = new List<A>(relatives);
        if (relativesList.isEmpty())
            return new QueryResult<any>();

        const aToRole = new OneToMany(this.relativeA, this.roleModel);
        return await aToRole.relationalFind(relativesList);
    }

    async relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>>
    {
        const roleToB = new ManyToOne(this.roleModel, this.relativeB);
        const roles = await this.getRoles(relatives);
        return await roleToB.relationalFind(roles);
    }

    set roleModel(roleModel: new () => AbstractStorableModel<any>)
    {
        this._roleModel = roleModel;
    }

    get roleModel(): new () => AbstractStorableModel<any>
    {
        return this._roleModel;
    }
}

export default ManyToMany;