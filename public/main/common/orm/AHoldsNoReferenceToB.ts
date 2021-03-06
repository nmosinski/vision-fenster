import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";
import { AnyNumber } from "../util/supportive";
import AbstractStorableModel from "./AbstractStorableModel";
import GetError from "./GetError";

const PATH = "public/main/common/orm/AHoldsNoReferenceToB.js";

abstract class AHoldsNoReferenceToB<A extends AbstractStorableModel<A>, B extends AbstractStorableModel<B>> extends NotManyToMany<A, B>
{
    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void>
    {
        const a: A = new List<A>(as).first();
        const bsList: List<B> = new List<B>(bs);

        bsList.foreach((b: B) =>
        {
            b[AbstractStorableModel.asFk(this.relativeA)] = a.id;
        });

        await AbstractStorableModel.update(bsList, AbstractStorableModel.asFk(this.relativeA));
    }

    async relationalGet(relative: A): Promise<B | never>
    {
        try
        {
            return new this.relativeB((await this.queryOfRelativeB().eq(relative.asFk(), relative.id).limit(1).execute()).first());
        } catch (err)
        {
            throw new GetError('A relative for the given model doesnt exist.', PATH, 'relationalGet', relative.id, relative.tableName, relative.storageDriver);
        }
    }

    async relationalDestroy(relatives: AnyNumber<A>): Promise<void>
    {
        const relativesList = new List<A>(relatives);

        if (relativesList.isEmpty())
            return;

        const toDestroy = await this.relationalFind(relativesList);

        await AbstractStorableModel.destroy(toDestroy);
    }

    areRelated(a: A, b: B): boolean
    {
        if (b[a.asFk()] === a.id)
            return true;
        return false;
    }

    async relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>>
    {
        const relativesList = new QueryResult<A>(relatives);
        if (relativesList.isEmpty())
            return new QueryResult();
        let query = this.queryOfRelativeB();
        query = query.hasSome(AbstractStorableModel.asFk(this.relativeA), relativesList.toPks());

        const result = new QueryResult<B>();

        (await query.execute()).foreach(item => result.add(new this.relativeB(item)));

        return result;
    }
}

export default AHoldsNoReferenceToB;