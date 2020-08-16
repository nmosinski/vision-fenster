import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import { Query } from "./WixDatabase";

class QueryResult<T extends AbstractModel<T>> extends List<T>
{
    constructor(list?: List<T> | Array<T>) {
        super((list) ? (list instanceof List) ? list.toArray() : list : undefined);
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

    /**
     * Loads related models.
     * If passed only one model, returns a QueryResult containing relatives of all items of this List allowing a chaining load operation.
     * If passed many models, returns this.
     * @param {...AbstractModel<any>} models The models to be loaded.
     * @return {QueryResult<any>} this or a QueryResult containing relatives of all items of this List.
     */
    async load(...models: Array<new () => AbstractModel<any>>): Promise<QueryResult<AbstractModel<any>>> {
        if (this.isEmpty())
            return this;
        let result: QueryResult<AbstractModel<any>> = this;
        let modelsList = new List<new () => AbstractModel<any>>(models);
        await modelsList.foreachAsync(async (Model: new () => AbstractModel<any>) => {
            let model = new Model();
            result = await model.getRelation(this.first().Model).relationalLoad(this);
        });

        if (modelsList.length === 1)
            return result;
        return this;
    }

    async loadChain(...models: Array<new () => AbstractModel<any>>): Promise<this> {
        let modelsList = new List<new () => AbstractModel<any>>();
        modelsList.addMultiple(models)

        let res = new QueryResult();
        res.addMultiple(this.toArray());
        await modelsList.foreachAsync(async (Model, idx) => {
            res = await res.load(Model);
        });
        return this;
    }
}

export default QueryResult;