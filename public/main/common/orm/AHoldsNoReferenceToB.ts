import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";
import WixDatabase, { Query } from "./WixDatabase";
import { AnyNumber } from "../util/supportive";

const PATH = "public/main/common/orm/AHoldsNoReferenceToB.js";

abstract class AHoldsNoReferenceToB<A extends AbstractModel<A>, B extends AbstractModel<B>> extends NotManyToMany<A, B>
{
    async assign(bs: AnyNumber<B>, as: AnyNumber<A>): Promise<void> {
        const a: A = new List<A>(as).first();
        const bsList: List<B> = new List<B>(bs);

        bsList.foreach((b: B) => {
            b[AbstractModel.asFk(this.relativeA)] = a.id;
        });
    }

    async relationalGet(relative: A): Promise<B | never> {
        return (await this.queryOfRelativeB().eq(relative.asFk(), relative.id).execute(1)).first();
    }

    async relationalDestroy(relatives: AnyNumber<A> = []): Promise<void> {
        const relativesList = new List<A>(relatives);

        if (relativesList.isEmpty())
            return;

        const toDestroy = await this.relationalFind(relativesList);

        await AbstractModel.destroy(toDestroy);
    }

    areRelated(a: A, b: B): boolean {
        if (b[a.asFk()] === a.id)
            return true;
        return false;
    }

    async relationalFind(relatives: AnyNumber<A>): Promise<QueryResult<B>> {
        const relativesList = new QueryResult<A>(relatives);
        if (relativesList.isEmpty())
            return new QueryResult();
        let query = this.queryOfRelativeB();
        query = query.hasSome(AbstractModel.asFk(this.relativeA), relativesList.toPks());

        const result = await query.execute();
        return result;
    }
}

export default AHoldsNoReferenceToB;