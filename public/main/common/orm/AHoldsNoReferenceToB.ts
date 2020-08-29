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
    link(bs: B | List<B>, as: A | List<A>): void {
        let a: A = (as instanceof List) ? as.first() : as;
        let bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        bsList.foreach((b: B) => {
            b[AbstractModel.asFk(this.relativeA)] = a.id;
        });
    }

    async relationalGet(relative: A): Promise<B | never> {
        return (await this.queryOfRelativeB().eq(relative.asFk(), relative.id).execute(1)).first();
    }

    async relationalDestroy(relatives: AnyNumber<A> = []): Promise<void> {
        let relativesList = new List<A>(relatives);

        if (relativesList.isEmpty())
            relativesList = await AbstractModel.find(this.relativeA);

        let toDestroy = await this.relationalFind(relativesList);

        await AbstractModel.destroy(toDestroy);
    }

    areRelated(a: A, b: B): boolean {
        if (b[a.asFk()] === a.id)
            return true;
        return false;
    }

    async relationalFind(relatives?: List<A>): Promise<QueryResult<B>> {
        let relativesList = new QueryResult<A>(relatives);
        if (relativesList.isEmpty())
            relativesList = await AbstractModel.find(this.relativeA);

        let query = this.queryOfRelativeB();
        query = query.hasSome(AbstractModel.asFk(this.relativeA), relativesList.toPks());

        let result = await query.execute();
        return result;
    }
}

export default AHoldsNoReferenceToB;