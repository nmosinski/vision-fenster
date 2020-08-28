import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";

const PATH = "public/main/common/orm/AHoldsNoReferenceToB.js";


/**
 * @todo
 */
abstract class AHoldsNoReferenceToB<A extends AbstractModel<A>, B extends AbstractModel<B>> extends NotManyToMany<A, B>
{
    link(bs: B | List<B>, as: A | List<A>): void {
        let a: A = (as instanceof List) ? as.first() : as;
        let bsList: List<B> = (bs instanceof List) ? bs : new List<B>([bs]);

        bsList.foreach((b: B) => {
            b[AbstractModel.asFk(this.relativeA)] = a.id;
        });
    }

    async relationalGet(relative: A): Promise<B> {
        return (await this.queryOfRelativeB().eq(relative.asFk(), relative.id).execute(1)).first();
    }

    async relationalCreate(toCreate: B, relatives?: List<A>): Promise<void> {

    }

    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> {
        await this.relationalCreate(toSave, relatives);
    }

    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> {
        await this.relationalCreate(toUpdate, relatives);
    }

    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }

    areRelated(a: A, b: B): boolean {
        if (b[a.asFk()] === a.id)
            return true;
        return false;
    }

    async relationalLoad(relatives: List<A>): Promise<QueryResult<B>> {
        let bs = await this.relationalFind(relatives);
        relatives.foreach((a: A) => {
            let related = new QueryResult<B>();
            bs.foreach((b: B) => {
                if (this.areRelated(a, b))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });

        bs.foreach((b: B) => {
            let related = new QueryResult<A>();
            relatives.foreach((a: A) => {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related.first();
        });

        return bs;
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> {
        if (relatives.isEmpty())
            return new QueryResult<B>();

        let query = this.queryOfRelativeB();
        query = query.hasSome(AbstractModel.asFk(this.relativeA), relatives.reduce("id"));

        let result = await query.execute();

        return result;
    }

    async relationalCreateMultiple(toCreate: List<B>, relatives?: List<A>): Promise<void> {

    }

    async relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        // throw new Error("Method not implemented.");
    }
    async relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> {
        // throw new Error("Method not implemented.");
    }
    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> {
        // Nothingto do.    
    }
}

export default AHoldsNoReferenceToB;