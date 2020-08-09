import AbstractModel from "./AbstractModel";
import Relation from "./Relation";
import List from "../util/collections/list/List";
import QueryResult from "./QueryResult";

const PATH = "public/main/common/orm/NotManyToMany.js";


abstract class NotManyToMany<A extends AbstractModel<A>, B extends AbstractModel<B>> extends Relation<A, B>
{
    abstract areRelated(a: A, b: B): boolean;

    async relationalLoad(relatives: List<A>): Promise<QueryResult<B>> {
        let bs = await this.relationalFind(relatives);
        relatives.foreach((a: A) => {
            let related = new List<B>();
            bs.foreach((b: B) => {
                if (this.areRelated(a, b))
                    related.add(b);
            });
            a[this.bAsPropertyNameForA()] = related;
        });
        return bs;
    }
}

export default NotManyToMany;