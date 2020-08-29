import AbstractModel from "./AbstractModel";
import List from "../util/collections/list/List";
import { Query } from "./WixDatabase";
import { AnyNumber } from "../util/supportive";

class QueryResult<T extends AbstractModel<T>> extends List<T>
{
    constructor(items?: AnyNumber<T>) {
        super(items);
    }

    /**
     * Get all primary keys of the items of this QueryResult in a new list.
     * @returns {List<string>} A list containing the primary keys of all items of this QueryResult.
     */
    toPks(): List<string> {
        return this.reduce('id');
    }

    /**
     * Create this models.
     */
    async create() {
        await AbstractModel.create(this);
    }

    /**
     * Save this models.
     */
    async save() {
        await AbstractModel.save(this);
    }

    /**
     * Update this models.
     */
    async update() {
        await AbstractModel.update(this);
    }

    /**
     * Destroy this models.
     */
    async destroy() {
        await AbstractModel.destroy(this);
    }

    /**
     * Assign this models to the given models.
     */
    async assign(models: AbstractModel<any> | List<AbstractModel<any>>) {
        AbstractModel.assign(models, this);
    }

    /**
     * Link this models to the given models.
     */
    async link(models: AbstractModel<any> | List<AbstractModel<any>>) {
        AbstractModel.link(models, this);
    }

    /**
     * Loads related models.
     * If passed only one model, returns a QueryResult containing relatives of all items of this List allowing a chaining load operation.
     * If passed many models, returns this.
     * @param {...AbstractModel<any>} models The models to be loaded.
     * @return {QueryResult<any>} this or a QueryResult containing relatives of all items of this List.
     */
    async load(models: AnyNumber<new () => AbstractModel<any>>): Promise<QueryResult<AbstractModel<any>>> {
        if (this.isEmpty())
            return new QueryResult();

        let modelsList = new List<new () => AbstractModel<any>>(models);
        let result: QueryResult<AbstractModel<any>> = this;

        await modelsList.foreachAsync(async (Model: new () => AbstractModel<any>) => {
            result = await this.first().getRelation(Model).inverse().relationalFind(this);
            result.assign(this);
        });

        if (modelsList.length === 1)
            return result;
        return this;
    }

    /**
     * Load models in chain mode.
     * @param {AnyNumber<new()=>AbstractModel<any>>} models The chain containing all models to be loaded in the corresponding order.
     * @returns {this} This. 
     */
    async loadChain(models: AnyNumber<new () => AbstractModel<any>>): Promise<this> {
        if (this.isEmpty())
            return this;

        let modelsList = new List<new () => AbstractModel<any>>(models);
        let res: QueryResult<AbstractModel<any>> = this;

        await modelsList.foreachAsync(async (Model, idx) => {
            res = await res.load(Model);
        });
        return this;
    }
}

export default QueryResult;