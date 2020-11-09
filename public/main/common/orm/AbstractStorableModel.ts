import List from "../util/collections/list/List";
import KVMap from "../util/collections/map/KVMap";
// @ts-ignore
import { v4 as UUID } from 'uuid';
import NullPointerException from "../util/error/NullPointerException";
import IComparable from "../util/IComparable";
import { AnyNumber } from "../util/supportive";
import AbstractModel, { Properties } from "./AbstractModel";
import CreateError from "./CreateError";
import DestroyError from "./DestroyError";
import ManyToMany from "./ManyToMany";
import ManyToOne from "./ManyToOne";
import MissingTableNameForDynamicAbstractStorableModelError from "./MissingTableNameForDynamicAbstractStorableModelError";
import OneToMany from "./OneToMany";
import OneToZeroOrOne from "./OneToZeroOrOne";
import QueryResult from "./QueryResult";
import Relation from "./Relation";
import SaveError from "./SaveError";
import UpdateError from "./UpdateError";
import ZeroOrOneToOne from "./ZeroOrOneToOne";
import JsTypes from "../util/jsTypes/JsTypes";
import Storage from "../persistance/model/Storage";
import IStorageDriver from "../persistance/model/IStorageDriver";
import WixDatabase from "../../../extern/wix/common/persistance/WixDatabase";
import InvalidOperationError from "../util/error/InvalidOperationError";

const PATH = 'public/main/common/orm/AbstractStorableModel';


abstract class AbstractStorableModel<T extends AbstractStorableModel<T>> extends AbstractModel<T> implements IComparable
{
    private _parent: AbstractStorableModel<any>;
    private _relations: KVMap<new () => AbstractStorableModel<any>, Relation<AbstractStorableModel<any>, T>>;
    protected _tableName: string;
    private _id: string;
    private _lastQueryResult: QueryResult<T> | AbstractStorableModel<T>;
    private _storageDriver: IStorageDriver;

    constructor (data?: object)
    {
        super(data);
    }

    /**
     * @override
     * @inheritdoc
     */
    protected boot(data?: object)
    {
        this.init(data);

        this.properties = new Properties();
        this.properties.
            string("id");
        this.addProperties();

        this.relations = new KVMap<new () => AbstractStorableModel<any>, Relation<AbstractStorableModel<any>, T>>();
        this.addRelations();

        // @todo make this more global / move to a better place
        if (!this.storageDriver)
            this.storageDriver = new WixDatabase();

        if (data)
            this.fill(data);
    }

    /**
     * Save all relations of this model.
     */
    abstract addRelations(): void

    /**
     * @override
     * @inheritdoc
     */
    equals(model: any): boolean
    {
        if (!(model instanceof AbstractStorableModel))
            return false;
        return (this.id === model.id) && (JsTypes.belongToTheSameClass(this, model));
    }

    /**
     * Check if has a relative.
     * @param {new()=>U, extends AbstractStorableModel<U>} Relative The class obejct/constructor of the relative.
     * @returns {boolean} True if has relative, else false.
     */
    public hasRelative<U extends AbstractStorableModel<U>>(Relative: new () => U): boolean
    {
        if (this.relations.has(Relative))
            return true;

        return false;
    }

    /**
     * Get a relative.
     * @param {new()=>U, extends AbstractStorableModel<U>} Relative The class obejct/constructor of the relative.
     * @returns {AbstractStorableModel<any>} The relative.
     */
    public relative<U extends AbstractStorableModel<U>>(Relative: new () => U): U
    {
        let relation: Relation<any, any>;
        try
        {
            relation = this.relations.get(Relative);
        } catch (err)
        {
            throw new NullPointerException(PATH, 'relative', 'A relatinship between ' + this + ' and ' + Relative + 'does not exist');
        }

        if (!relation)
            throw new NullPointerException(PATH, "relative", "A relation to the given relative " + Relative + " does not exist");

        const relative = new Relative();
        relative.parent = this;
        return relative;
    }

    /**
     * Add a relation of 0..1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 0..1 to 1 - this has one Model.
     */
    zeroOrOneToOne<U extends AbstractStorableModel<U>>(Model: new () => U): void
    {
        // This logic inverse.

        this.relations.add(Model, new OneToZeroOrOne(Model, this.Constructor));
        this.properties.string(AbstractStorableModel.asFk(Model));
    }

    /**
     * Add a relation of 1 to 0..1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 0..1 - this has one optional Model.
     */
    oneToZeroOrOne<U extends AbstractStorableModel<U>>(Model: new () => U): void
    {
        // This logic inverse.

        this.relations.add(Model, new ZeroOrOneToOne(Model, this.Constructor));
    }

    /**
     * Add a relation of 1 to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to n - this has many Models.
     */
    oneToMany<U extends AbstractStorableModel<U>>(Model: new () => U): void
    {
        // This logic, inverse.

        this.relations.add(Model, new ManyToOne(Model, this.Constructor));
    }

    /**
     * Add a relation of n to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to 1 - this belongs to one Model.
     */
    manyToOne<U extends AbstractStorableModel<U>>(Model: new () => U): void
    {
        // This logic, inverse.
        this.relations.add(Model, new OneToMany(Model, this.Constructor));
        this.properties.string(AbstractStorableModel.asFk(Model));
    }

    /**
     * @todo
     * Add a relation of n to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to n - this belongs to many Models.
     */
    manyToMany<U extends AbstractStorableModel<U>>(Model: new () => U): void
    {
        const thisTableName = this.tableName;
        const thisAsFk = this.asFk();

        // tslint:disable-next-line: max-classes-per-file
        const roleModelClass = class RoleModel extends AbstractStorableModel<RoleModel> implements IComparable
        {
            protected modelName: string;
            protected Constructor: new () => RoleModel;

            init(): void
            {
                this.Constructor = RoleModel;
                this.modelName = 'RoleModel';
            }

            addProperties(): void
            {
                this.properties.
                    string(AbstractStorableModel.asFk(Model)).
                    string(thisAsFk);
            }

            addRelations(): void
            // tslint:disable-next-line: no-empty
            {

            }

            /**
             * @override
             */
            equals(object: any): boolean
            {
                if (!(object instanceof RoleModel))
                    return false;
                if (object.tableName !== this.tableName)
                    return false;

                const thisIdA = this[AbstractStorableModel.asFk(Model)];
                const objectIdA = object[AbstractStorableModel.asFk(Model)];

                if (thisIdA === objectIdA && this[thisAsFk] === object[thisAsFk])
                    return true;
                else if (thisIdA === object[thisAsFk] && this[thisAsFk] === objectIdA)
                    return true;
                else
                    return false;
            }

            /**
             * @override
             */
            get tableName()
            {
                return AbstractStorableModel.roleTableNameOf(thisTableName, AbstractStorableModel.tableName(Model));
            }
        }

        this.relations.add(Model, new ManyToMany(Model, this.Constructor, roleModelClass));
    }

    /**
     * Check if the parent of this is the root.
     * @returns {boolean} True if the parent is the root, else false.
     */
    private myParentIsTheRoot(): boolean
    {
        if (this.parent)
            if (!this.parent.parent)
                return true;
        return false;
    }

    /**
     * Assign the given model (this by default) to the given relative. They are related after this operation.
     * @param {U extends AbstractStorableModel<U>, AnyNumber<U>} relatives The relatives the given model will be assigned to.
     * @returns {this} This.
     */
    async assign<U extends AbstractStorableModel<U>>(relatives: AnyNumber<U>): Promise<this>
    {
        await AbstractStorableModel.assign(this as unknown as T, relatives);
        return this;
    }

    /**
     * Assign the given models to the given relatives. They are related after this operation.
     * @param {P extends AbstractStorableModel<P>, AnyNumber<P>} models The models to be assigned.
     * @param {U extends AbstractStorableModel<U>, AnyNumber<U>} relatives The relatives the given model will be assigned to.
     */
    static async assign<P extends AbstractStorableModel<P>, U extends AbstractStorableModel<U>>(models: AnyNumber<P>, relatives: AnyNumber<U>): Promise<void>
    {
        const modelsList = new List<P>(models);
        const relativesList = new List<U>(relatives);
        if (modelsList.isEmpty() || relativesList.isEmpty())
            return;

        return modelsList.first().relations.get(relativesList.first().Constructor).assign(models, relatives);
    }

    /**
     * Link the given model (this by default) to the given relative it has been assigned to the relatives.
     * @param {U extends AbstractStorableModel<U>, AnyNumber<U>} relatives The relatives the given model will be linked to.
     * @returns {this} This.
     */
    async link<U extends AbstractStorableModel<U>>(relatives: AnyNumber<U>): Promise<this>
    {
        await AbstractStorableModel.link(this as unknown as T, relatives);
        return this;
    }

    /**
     * Link the given models to the given relatives if they have been assigned to each other.
     * @param {T extends AbstractStorableModel<T>, AnyNumber<T>} models The models to be linked.
     * @param {U extends AbstractStorableModel<U>, AnyNumber<U>} relatives The relatives the given model will be linked to.
     */
    static async link<P extends AbstractStorableModel<P>, U extends AbstractStorableModel<U>>(models: AnyNumber<P>, relatives: AnyNumber<U>): Promise<void>
    {
        const modelsList = new List<P>(models);
        const relativesList = new List<U>(relatives);
        if (modelsList.isEmpty() || relativesList.isEmpty())
            return;
        await modelsList.first().relations.get(relativesList.first().Constructor).link(models, relatives);
    }

    async assignAndLink<U extends AbstractStorableModel<U>>(relatives: AnyNumber<U>): Promise<this>
    {
        await this.assign(relatives);
        await this.link(relatives);
        return this;
    }

    static async assignAndLink<U extends AbstractStorableModel<U>, P extends AbstractStorableModel<P>>(models: AnyNumber<U>, relatives: AnyNumber<P>): Promise<void>
    {
        await AbstractStorableModel.assign(models, relatives);
        await AbstractStorableModel.link(models, relatives);
    }

    /**
     * Load Models.
     * @param {<U extends AbstractStorableModel<U>>, AnyNumber<new() => U>} Models The Models (classes) to be loaded.
     * @returns {Promise<this|QueryResult<AbstractStorableModel>>} This if multiple models were passed or
     * the loaded objects if only one model was passed (allowing to chain operations).
     */
    async load(Relatives: AnyNumber<new () => AbstractStorableModel<any>>): Promise<void>
    {
        const RelativesList = new List<new () => AbstractStorableModel<any>>(Relatives);

        return await AbstractStorableModel.load(this as unknown as T, RelativesList)
    }

    static async load<U extends AbstractStorableModel<U>, P extends AbstractStorableModel<P>>(models: AnyNumber<U>, Relatives: AnyNumber<new () => P>): Promise<void>
    {
        const modelsList = new List<U>(models);
        const RelativesList = new List<new () => P>(Relatives);

        if (modelsList.isEmpty() || RelativesList.isEmpty())
            return;

        await RelativesList.foreachAsync(async (relative) =>
        {
            const relatives = await modelsList.first().relations.get(relative).inverse().relationalFind(modelsList);
            await relatives.link(modelsList);
        });
        return;
    }

    /**
     * Loads many models that are stored as property and can be accessed indirectly model by model creating a chain.
     * @param {AnyNumber<new()=>AbstractStorableModel<any>>} models The models to be loaded in the order of the chain.
     * @returns {this} This.
     */
    async loadChain(Relatives: AnyNumber<new () => AbstractStorableModel<any>>): Promise<void>
    {
        const RelativesList = new List<new () => AbstractStorableModel<any>>(Relatives);

        return await AbstractStorableModel.loadChain(this as unknown as T, RelativesList);
    }

    static async loadChain<U extends AbstractStorableModel<U>, P extends AbstractStorableModel<P>>(models: AnyNumber<U>, Relatives: AnyNumber<new () => P>): Promise<void>
    {
        let modelsList = new List<AbstractStorableModel<any>>(models);
        const RelativesList = new List<new () => P>(Relatives);

        if (modelsList.isEmpty() || RelativesList.isEmpty())
            return;

        await RelativesList.foreachAsync(async (relative) =>
        {
            const newModelsList = await modelsList.first().relations.get(relative).inverse().relationalFind(modelsList);
            await AbstractStorableModel.link(modelsList, newModelsList);
            modelsList = newModelsList;
        });
        return;
    }

    /**
     * Check if an entity of this model with the given id exists.
     * @param {string} id The id of the entity.
     * @returns {boolean} True if exists, else false.
     */
    async exists(id: string): Promise<boolean>
    {
        return AbstractStorableModel.exists(id, this.Constructor);
    }

    /**
     * Check if an entity of the given model with the given id exists.
     * @param {string} id The id of the entity.
     * @param {new()=>U} Model The Model of the entity.
     * @returns {boolean} True if exists, else false.
     */
    static async exists<U extends AbstractStorableModel<U>>(id: string, Model: new () => U): Promise<boolean>
    {
        const model = new Model();
        if (await Storage.has(id, model.tableName, model.storageDriver))
            return true;

        return false;
    }

    /**
     * Get this item with the data in database.
     * @return {Promise<T>} The item.
     */
    async synchronize(): Promise<this>
    {
        const item = await AbstractStorableModel.get(this.id, this.Constructor);
        return this.fill(item);
    }

    /**
     * Get an item of the given model by the given id.
     * @param {string} pk The primary key of the item to be retrieved.
     * @param {new()=>U} model The model of the item to be retrieved.
     * @returns {Promise<U>} The retrueved model.
     */
    static async get<U extends AbstractStorableModel<U>>(id: string, Model: new () => U): Promise<U>
    {
        const model = new Model();
        return model.fill(await Storage.get(id, model.tableName, model.storageDriver));
    }

    /**
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
     * If called over a relative, return only those entities that are related to the query result returned by the chained query.
     * @returns {Promise<QueryResult<T>>} The result of the executed query.
     */
    async find(): Promise<QueryResult<T>>
    {
        let thisQueryResult: QueryResult<T>;
        // Called over previous.
        if (this.parent)
        {
            let previousQueryResult: QueryResult<AbstractStorableModel<any>>;
            let propertyTarget: AbstractStorableModel<any> | QueryResult<AbstractStorableModel<any>>;
            let propertyName: string;
            let relationToParent: Relation<AbstractStorableModel<any>, T>;

            // If it's a first generation find, find only items that belong to the parent
            if (this.myParentIsTheRoot())
            {
                previousQueryResult = new QueryResult<AbstractStorableModel<any>>(this.parent);
                propertyTarget = this.parent;
            }
            else
            {
                previousQueryResult = await this.parent.find();
                propertyTarget = this.parent.lastQueryResult;
            }

            relationToParent = this.relations.get(this.parent.Constructor);

            thisQueryResult = await relationToParent.relationalFind(previousQueryResult);

            if (relationToParent instanceof ManyToMany || relationToParent instanceof OneToMany)
                propertyName = this.asMultiplePropertyName();
            else
                propertyName = this.asSinglePropertyName();
            // Assign the result as property to parent as list or single one.
            if (((relationToParent instanceof ManyToOne) || (relationToParent instanceof OneToZeroOrOne) || (relationToParent instanceof ZeroOrOneToOne)))
            {
                propertyTarget[propertyName] = thisQueryResult.firstOrNull();
                this.lastQueryResult = (thisQueryResult.firstOrNull() === null) ? new QueryResult() : thisQueryResult.first();
            }
            else
            {
                propertyTarget[propertyName] = thisQueryResult;
                this.lastQueryResult = thisQueryResult;
            }
        }
        else
        {
            thisQueryResult = await AbstractStorableModel.find(this.Constructor);
        }

        return thisQueryResult;
    }

    /**
     * Find all entities returned by the given QueryElement.
     * @param {model: new()=>U} model The QueryElement to be resolved.
     * @returns {Promise<QueryResult<<U extends AbstractStorableModel<U>>>>} The result of the executed querry.
     */
    static async find<U extends AbstractStorableModel<U>>(Model: new (data?: object) => U): Promise<QueryResult<U>>
    {
        const model = new Model();
        return new QueryResult<U>((await Storage.query(model.tableName, model.storageDriver).limit(1000).execute()).map((item: object) => new Model(item)));
    }

    /**
     * Create this model (save it in the database).
     */
    async create(): Promise<List<string>>
    {
        return await AbstractStorableModel.create(this as unknown as T);
    }

    /**
     * Create models.
     * @param {AnyNumber<U>} models The models to be created.
     */
    static async create<U extends AbstractStorableModel<U>>(models: AnyNumber<U>): Promise<List<string>>
    {
        const modelsList = new QueryResult<U>(models);

        if (modelsList.isEmpty())
            return new List<string>();

        modelsList.foreach((model) =>
        {
            if (!model.id)
                model.id = UUID();
        });

        modelsList.foreach((model) =>
        {
            if (!model.valid())
                throw new CreateError('One of the given models is not valid.', PATH, "AbstractStorableModel.create()", model.id, model.tableName, model.storageDriver);
        });

        return await modelsList.storage.create(modelsList.strip(), modelsList.tableName);
    }

    /**
     * Save this model (save it in the database).
     */
    async save(): Promise<List<string>>
    {
        return await AbstractStorableModel.save(this as unknown as T);
    }

    /**
     * Save models.
     * @param {U|List<U>} models The models to be saved.
     */
    static async save<U extends AbstractStorableModel<U>>(models: AnyNumber<U>): Promise<List<string>>
    {
        const modelsList = new QueryResult<U>(models);

        if (modelsList.isEmpty())
            return new List<string>();

        modelsList.foreach((model) =>
        {
            if (!model.id)
                model.id = UUID();
        });

        modelsList.foreach((model) =>
        {
            if (!model.valid())
                throw new SaveError(null, PATH, "AbstractStorableModel.save()", model.id, model.tableName, model.storageDriver);
        });

        return await modelsList.storage.save(modelsList.strip(), modelsList.tableName);
    }

    /**
     * Update this model (update it in the database).
     */
    async update(fieldsToUpdate?: AnyNumber<string>): Promise<void>
    {
        return await AbstractStorableModel.update(this as unknown as T, fieldsToUpdate);
    }

    /**
     * Update models.
     * @param {U | List<U>} toUpdate The models to be updated.
     */
    static async update<U extends AbstractStorableModel<U>>(toUpdate: AnyNumber<U>, fieldsToUpdate?: AnyNumber<string>): Promise<void>
    {
        const toUpdateList = new QueryResult<U>(toUpdate);
        let fieldsToUpdateList = new List<string>(fieldsToUpdate);

        if (toUpdateList.isEmpty())
            return;

        if (fieldsToUpdateList.isEmpty())
            fieldsToUpdateList = toUpdateList.first().properties.keys();

        if (fieldsToUpdateList.has('id'))
            fieldsToUpdateList.remove(fieldsToUpdateList.indexOf('id'));

        const fieldsNotToBeUpdated = toUpdateList.properties.keys().WITHOUT(fieldsToUpdateList);

        const existentItems: List<object> = await toUpdateList.storage.query(toUpdateList.tableName).hasSome('_id', toUpdateList.pluck('id')).execute();

        const reducedExistentItems = existentItems.map(item =>
        {
            const reducedItem = {};

            fieldsNotToBeUpdated.foreach(fieldName => reducedItem[fieldName] = item[fieldName]);

            return reducedItem;
        });

        toUpdateList.foreach((model) =>
        {
            try
            {
                // @ts-ignore
                model.fill(reducedExistentItems.find(item => item.id === model.id));
            } catch (error)
            {
                throw new UpdateError('Some of the items that are meant to be updated do not exist in the given storage.', PATH, 'update', toUpdateList.pluck('id').toString(), toUpdateList.tableName, toUpdateList.first().storageDriver);
            }
        });

        return await toUpdateList.storage.update(toUpdateList.map(model => model.strip()), toUpdateList.tableName);
    }

    /**
     * Destroy this model (destroy it in the database).
     * If called over relations, destroy the models returned by the query.
     * @param {boolean} [doNotCascade=false] Will not destroy relatives that belong to this model if true.
     */
    async destroy(doNotCascade = false): Promise<void>
    {
        let toDestroy: List<AbstractStorableModel<any>> = new List<AbstractStorableModel<any>>(this);
        // Called over previous.
        if (this.parent)
        {
            toDestroy = await this.find();
        }

        return await AbstractStorableModel.destroy(toDestroy, doNotCascade);
    }

    /**
     * Destroy models.
     * @param {U | List<U>} models The models to be destroyed.
     * @param {boolean} [doNotCascade=false] Will not destroy relatives that belong to this model if true.
     */
    static async destroy<U extends AbstractStorableModel<U>>(models: AnyNumber<U>, doNotCascade = false): Promise<void>
    {
        const modelsList = new QueryResult<U>(models);

        if (modelsList.isEmpty())
            return;

        if (!doNotCascade)
            await modelsList.first().relations.values().foreachAsync(async (relation) =>
            {
                await relation.inverse().relationalDestroy(modelsList);
            });

        await modelsList.storage.remove(modelsList.pluck('id'), modelsList.tableName);
    }

    /**
     * Get the primary key column name of this model.
     * @returns {string} The primary key column name.
     */
    public asPk(): string
    {
        return "id";
    }

    /**
     * Get the foreign key column name of this model.
     * @returns {string} The foreign key column name.
     */
    public asFk(): string
    {
        return this.tableName.charAt(0).toLowerCase() + this.tableName.slice(1) + "Id";
    }

    /**
     * Get the foreign key column name of the given model.
     * @param {U extends AbstractStorableModel<U>} Model The model the foreign key column name will be returned of.
     * @returns {string} The foreign key column name.
     */
    static asFk<U extends AbstractStorableModel<U>>(Model: new () => U): string
    {
        return (new Model()).asFk();
    }

    /**
     * Get the default name of this Model as a single property.
     * @returns {string} The name of this Model as a single property.
     */
    public asSinglePropertyName(): string
    {
        return this.tableName.charAt(0).toLowerCase() + this.tableName.slice(1);
    }

    public getRelation<U extends AbstractStorableModel<U>>(relative: new () => U): Relation<any, T>
    {
        return this.relations.get(relative);
    }

    static asSinglePropertyName<U extends AbstractStorableModel<U>>(Model: new () => U): string
    {
        return (new Model()).asSinglePropertyName();
    }

    /**
     * Get the default name of this Model as a multiple property.
     * @returns {string} The name of this Model as a multiple property.
     */
    public asMultiplePropertyName(): string
    {
        return this.asSinglePropertyName() + "s";
    }

    static asMultiplePropertyName<U extends AbstractStorableModel<U>>(Model: new () => U): string
    {
        return (new Model()).asMultiplePropertyName();
    }

    /**
     * Get the name of the role table of two models named by the given names.
     * @param {string} modelName1 The name of the first model.
     * @param {string} modelName2 The name of the second model.
     * @returns {string} The name of the role table of two models named by the given names.
     */
    static roleTableNameOf(modelName1: string, modelName2: string): string
    {
        const ending = (modelName1.toLowerCase() < modelName2.toLowerCase()) ? modelName1 + modelName2 : modelName2 + modelName1;
        return "Role" + ending;
    }

    static tableName<U extends AbstractStorableModel<U>>(Model: new () => U): string
    {
        try
        {
            return (new Model()).tableName;
        }
        catch (err)
        {
            if (err instanceof MissingTableNameForDynamicAbstractStorableModelError)
            {
                throw new MissingTableNameForDynamicAbstractStorableModelError('Trying to access static tableName method of DynamicAbstractModel', PATH, 'tableName');
            }
            throw err;
        }
    }

    /**
     * Get the table name of this model. Resolves into the name of the model/class by default.
     * @returns {string} The name of the table of this model.
     */
    get tableName(): string
    {
        return (this._tableName) ? this._tableName : this.modelName;
    }

    /**
     * Set the primary key of this model.
     * @param {string} id The new primary key.
     */
    set id(id: string)
    {
        this._id = id;
    }

    /**
     * Get the primary key of this model.
     * @returns {string} The primary key of this model.
     */
    get id(): string
    {
        return this._id;
    }

    /**
     * Set the last query result.
     * @param {QueryResult<T>} lastQueryResult The last query result.
     */
    private set lastQueryResult(lastQueryResult: QueryResult<T> | AbstractStorableModel<T>)
    {
        this._lastQueryResult = lastQueryResult;
    }

    /**
     * Get the last query result.
     * @returns {QueryResult<T>} The last query result.
     */
    private get lastQueryResult(): QueryResult<T> | AbstractStorableModel<T>
    {
        return this._lastQueryResult;
    }

    /**
     * Set parent.
     * @param {AbstractStorableModel<any>} parent The parent.
     */
    private set parent(parent: AbstractStorableModel<any>)
    {
        this._parent = parent;
    }

    /**
     * Get parent.
     * @returns {AbstractStorableModel<any>} The parent.
     */
    private get parent(): AbstractStorableModel<any>
    {
        return this._parent;
    }

    /**
     * Get the root element.
     * @returns {AbstractStorableModel<any>} The root element or this, if this is the root element.
     */
    private get root(): AbstractStorableModel<any>
    {
        let next: AbstractStorableModel<any> = this;
        while (next.parent)
            next = next.parent;
        return next;
    }

    /**
     * Set all relations of this model.
     * @param {KVMap<new()=>AbstractStorableModel<any>, Relation<new()=>AbstractStorableModel<any>, new()=>T>>} relations The relations.
     */
    private set relations(relations: KVMap<new () => AbstractStorableModel<any>, Relation<AbstractStorableModel<any>, T>>)
    {
        this._relations = relations;
    }

    /**
     * Get all relations of this model.
     * @returns {KVMap<AbstractStorableModel<any>, Relation<AbstractStorableModel<any>, T>>} The relations.
     */
    private get relations(): KVMap<new () => AbstractStorableModel<any>, Relation<AbstractStorableModel<any>, T>>
    {
        return this._relations;
    }

    public set storageDriver(storageDriver: IStorageDriver)
    {
        this._storageDriver = storageDriver;
    }

    public get storageDriver(): IStorageDriver
    {
        return this._storageDriver;
    }

    public get storage(): Storage
    {
        return new Storage(this.storageDriver);
    }
}

export default AbstractStorableModel;