import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";

class QueryResult<T extends AbstractModel<T>> extends List<T>
{
    constructor(list?: List<T>) {
        super((list) ? list.toArray() : undefined);
    }

    /**
     * Get all primary keys of the items of this QueryResult in a new list.
     * @returns {List<string>} A list containing the primary keys of all items of this QueryResult.
     */
    toPks(): List<string> {
        let pks = new List<string>();
        this.foreach((item) => { pks.add(item.id); });
        return pks;
    }

    load(...models: Array<new () => AbstractModel<any>>): this {
        this.foreach((el) => {
            el.load.apply(el, models);
        });
        return this;
    }
}

export default QueryResult;