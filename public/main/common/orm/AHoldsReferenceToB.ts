import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import Set from "../util/collections/set/Set";
import QueryResult from "./QueryResult";
import NotManyToMany from "./NotManyToMany";

const PATH = "public/main/common/orm/AHoldsReferenceToB.js";


abstract class AHoldsReferenceToB<A extends AbstractModel<A>, B extends AbstractModel<B>> extends NotManyToMany<A, B>
{
    link(bs: B | List<B>, as: A | List<A>): void {
        let asList: List<A> = (as instanceof List) ? as : new List<A>([as]);
        let b: B = (bs instanceof List) ? bs.first() : bs;

        asList.foreach((a: A) => {
            a[AbstractModel.asFk(this.relativeB)] = b.id;
        });
    }

    async relationalGet(relative: A): Promise<B> {
        return (await this.relationalFind(new List([relative]))).first();
    }

    async relationalCreate(toCreate: B, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }
    async relationalSave(toSave: B, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }
    async relationalUpdate(toUpdate: B, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }

    async relationalDestroy(toDestroy: B, relatives?: List<A>): Promise<void> {
        let asToDestroy: List<A>;

        if (!relatives)
            asToDestroy = await this.queryOfRelativeA().eq(toDestroy.asFk(), toDestroy.id).execute();
        else {
            asToDestroy = relatives.filter((a) => { return a[toDestroy.asFk()] === toDestroy.id; });
        }

        await AbstractModel.destroyMultiple(asToDestroy);
    }

    areRelated(a: A, b: B): boolean {
        if (a[b.asFk()] === b.id)
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
            a[this.bAsPropertyNameForA()] = related.first();
        });

        bs.foreach((b: B) => {
            let related = new QueryResult<A>();
            relatives.foreach((a: A) => {
                if (this.areRelated(a, b))
                    related.add(a);
            });
            b[this.aAsPropertyNameForB()] = related;
        });

        return bs;
    }

    async relationalFind(relatives: List<A>): Promise<QueryResult<B>> {
        if (relatives.isEmpty())
            return new QueryResult<B>();

        let aRelativeB = new this.relativeB();
        let bQuery = this.queryOfRelativeB();
        let toFindIds: Set<string> = new Set<string>(relatives.reduce(aRelativeB.asFk()).toArray());
        bQuery = bQuery.hasSome("_id", toFindIds);

        return await bQuery.execute();
    }

    async relationalCreateMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }
    async relationalSaveMultiple(toSave: List<B>, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }
    async relationalUpdateMultiple(toUpdate: List<B>, relatives?: List<A>): Promise<void> {
        // Nothing to do.
    }
    async relationalDestroyMultiple(toDestroy: List<B>, relatives?: List<A>): Promise<void> {
        let asToDestroy = new List<A>();
        let bInstance = new this.relativeB();

        if (!relatives)
            asToDestroy = await this.queryOfRelativeA().hasSome(bInstance.asFk(), toDestroy.reduce("id")).execute();
        else
            asToDestroy = relatives.filter((a) => { return toDestroy.toArray().includes(a[bInstance.asFk()]); });

        await AbstractModel.destroyMultiple(asToDestroy);
    }

}

export default AHoldsReferenceToB;