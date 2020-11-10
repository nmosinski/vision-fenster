import List from "../util/collections/list/List";
import InvalidOperationError from "../util/error/InvalidOperationError";
import { AnyNumber } from "../util/supportive";
import AbstractStorableModel from "./AbstractStorableModel";
import Storage from "../persistance/model/Storage";
import { Properties } from "./AbstractModel";

const PATH = 'public/main/common/orm/QueryResult'

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
        return this.pluck('id');
    }

    /**
     * Create this models.
     */
    async create(): Promise<List<string>>
    {
        return await AbstractStorableModel.create(this);
    }

    /**
     * Save this models.
     */
    async save(): Promise<List<string>>
    {
        return await AbstractStorableModel.save(this);
    }

    /**
     * Update this models.
     */
    async update(): Promise<void>
    {
        return await AbstractStorableModel.update(this);
    }

    /**
     * Destroy this models.
     */
    async destroy(): Promise<void>
    {
        return await AbstractStorableModel.destroy(this);
    }

    /**
     * Assign the given relatives to this models.
     */
    async assign(relatives: AnyNumber<AbstractStorableModel<any>>): Promise<void>
    {
        return await AbstractStorableModel.assign(this, relatives);
    }

    /**
     * Link the given relatives to this models.
     */
    async link(relatives: AnyNumber<AbstractStorableModel<any>>): Promise<void>
    {
        return await AbstractStorableModel.link(this, relatives);
    }

    /**
     * Assign and link the given relatives to this models.
     */
    async assignAndLink(relatives: AnyNumber<AbstractStorableModel<any>>): Promise<void>
    {
        return await AbstractStorableModel.assignAndLink(this, relatives);
    }

    /**
     * Loads related models.
     * @param {...AbstractStorableModel<any>} Relatives The models to be loaded.
     */
    async load(Relatives: AnyNumber<new () => AbstractStorableModel<any>>): Promise<void>
    {
        return await AbstractStorableModel.load(this, Relatives);
    }

    /**
     * Load models in chain mode.
     * @param {AnyNumber<new()=>AbstractStorableModel<any>>} Relatives The chain containing all models to be loaded in the corresponding order.
     */
    async loadChain(Relatives: AnyNumber<new () => AbstractStorableModel<any>>): Promise<void>
    {
        return await AbstractStorableModel.loadChain(this, Relatives);
    }

    /**
     * Strip this models.
     * @param {List<string>} [propertyNamesToConsider] The properties to be considered.
     * @returns {List<object>} this models stripped.
     */
    strip(propertyNamesToConsider?: List<string>): List<object>
    {
        return this.map(model => model.strip(propertyNamesToConsider));
    }

    /**
     * Get the table name of this models.
     * @returns {string} the table name.
     */
    get tableName(): string
    {
        if (this.isEmpty())
            throw new InvalidOperationError(PATH, 'get tableName', 'The list is empty. Therefore no table name can be returned as the first element is missing.');
        return this.first().tableName;
    }

    /**
     * Get the storage of this models.
     * @returns {Storage} the storage.
     */
    get storage(): Storage
    {
        if (this.isEmpty())
            throw new InvalidOperationError(PATH, 'get storage', 'The list is empty. Therefore no storage can be returned as the first element is missing.');
        return this.first().storage;
    }

    /**
     * Get the properties of this models.
     * @returns {Properties} the properties.
     */
    get properties(): Properties
    {
        if (this.isEmpty())
            throw new InvalidOperationError(PATH, 'get properties', 'The list is empty. Therefore no properties can be returned as the first element is missing.');
        return this.first().properties;
    }
}

export default QueryResult;