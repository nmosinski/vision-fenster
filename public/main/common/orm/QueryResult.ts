import List from "../util/collections/list/List";
import { AnyNumber } from "../util/supportive";
import AbstractStorableModel from "./AbstractStorableModel";

class QueryResult<T extends AbstractStorableModel<T>> extends List<T>
{
    constructor (items?: AnyNumber<T>)
    {
        super(items);
    }

    /**
     * Get all primary keys of the items of this QueryResult in a new list.
     * @returns {List<string>} A list containing the primary keys of all items of this QueryResult.
     */
    toPks(): List<string>
    {
        return this.reduce('id');
    }

    /**
     * Create this models.
     */
    async create()
    {
        await AbstractStorableModel.create(this);
    }

    /**
     * Save this models.
     */
    async save()
    {
        await AbstractStorableModel.save(this);
    }

    /**
     * Update this models.
     */
    async update()
    {
        await AbstractStorableModel.update(this);
    }

    /**
     * Destroy this models.
     */
    async destroy()
    {
        await AbstractStorableModel.destroy(this);
    }

    /**
     * Assign this models to the given models.
     */
    async assign(models: AnyNumber<AbstractStorableModel<any>>)
    {
        await AbstractStorableModel.assign(models, this);
    }

    /**
     * Link this models to the given models.
     */
    async link(models: AnyNumber<AbstractStorableModel<any>>)
    {
        await AbstractStorableModel.link(models, this);
    }

    async assignAndLink(models: AnyNumber<AbstractStorableModel<any>>)
    {
        await this.assign(models);
        await this.link(models);
    }

    /**
     * Loads related models.
     * If passed only one model, returns a QueryResult containing relatives of all items of this List allowing a chaining load operation.
     * If passed many models, returns this.
     * @param {...AbstractStorableModel<any>} models The models to be loaded.
     * @return {QueryResult<any>} this or a QueryResult containing relatives of all items of this List.
     */
    async load(models: AnyNumber<new () => AbstractStorableModel<any>>): Promise<QueryResult<AbstractStorableModel<any>>>
    {
        if (this.isEmpty())
            return new QueryResult();

        const modelsList = new List<new () => AbstractStorableModel<any>>(models);
        let result: QueryResult<AbstractStorableModel<any>> = this;

        await modelsList.foreachAsync(async (Model: new () => AbstractStorableModel<any>) =>
        {
            result = await this.first().getRelation(Model).inverse().relationalFind(this);
            await result.link(this);
        });

        if (modelsList.length === 1)
            return result;
        return this;
    }

    /**
     * Load models in chain mode.
     * @param {AnyNumber<new()=>AbstractStorableModel<any>>} models The chain containing all models to be loaded in the corresponding order.
     * @returns {this} This. 
     */
    async loadChain(models: AnyNumber<new () => AbstractStorableModel<any>>): Promise<this>
    {
        if (this.isEmpty())
            return this;

        const modelsList = new List<new () => AbstractStorableModel<any>>(models);
        let res: QueryResult<AbstractStorableModel<any>> = this;

        await modelsList.foreachAsync(async (Model, idx) =>
        {
            res = await res.load(Model);
        });
        return this;
    }
}

export default QueryResult;