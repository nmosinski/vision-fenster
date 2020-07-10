const PATH = "public/main/common/orm/AbstractModel.js";

//@ts-ignore
import { v4 as UUID } from 'uuid';
import Set from "../util/collections/set/Set.js";
import IComparable from '../util/IComparable';
import KVMap from '../util/collections/map/KVMap';
import Relation from './Relation';
import List from '../util/collections/list/List';
import JsTypes from '../util/jsTypes/JsTypes';
import OneToZeroOrOne from './OneToZeroOrOne';
import ZeroOrOneToOne from './ZeroOrOneToOne';
import ManyToOne from './ManyToOne';
import OneToMany from './OneToMany';
import WixDatabase from './WixDatabase';
import QueryResult from './QueryResult';
import ManyToMany from './ManyToMany';
import CreateError from './CreateError';
import SaveError from './SaveError';
import UpdateError from './UpdateError';
import DestroyError from './DestroyError';
import InvalidOperationError from '../util/error/InvalidOperationError';
import AHoldsReferenceToB from './AHoldsReferenceToB.js';

/**
 * @todo Add undo operations for save etc. Important in case a save is not possible but uve updated already some references.
 */

/**
 * @class
 * A class representing an abstract model.
 */

abstract class AbstractModel<T extends AbstractModel<T>> implements IComparable
{
    private _previousRelative: AbstractModel<any>;
    private _relations: KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>;
    protected abstract Constructor: new()=>T;
    protected _properties: Properties;
    private _id: string;

    /**
     * Create an Abstract Model.
     */
    constructor(data?: object)
    {
        this.previousRelative = null;
        this.relations = new KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>();
        this.properties = new Properties();

        this.properties.
        string("id");
        
        this.init();
        this.addProperties();
        this.addRelations();
        this.fill(data);
    }

    abstract init(): void;

    /**
     * Get a new instance of this.
     * @returns {T} A new instance.
     */
    instance(): T
    {
        return new this.Constructor();       
    }

    /**
     * Add properties.
     */
    abstract addProperties(): void


    /**
     * Save all relations of this model.
     */
    abstract addRelations(): void;

    /**
     * Get a valid dummy of the given model.
     * @param {U extends AbstractModel<U>} Model The model of which a dummy will be created.
     * @returns {T} A dummy initialized with valid data.
     */
    static dummy<U extends AbstractModel<U>>(Model: new()=>U, customChanges: KVMap<string, any>=null): U
    {
        let t = new Model();
        let item = {};

        t.properties.foreach((propertyName, property)=>{item[propertyName] = property.dummy();});
        t = t.fill(item);

        if(customChanges)
            customChanges.foreach((propertyname, value)=>{t[propertyname] = value;});
        return t;
    }

    /**
     * Get multiple instances of a dummy of this model.
     * @param {U extends AbstractModel<U>} Model The model of which duummies will be created.
     * @param {number} count The amount of dummies to be created.
     * @returns {List<T>} A list containing the given amount of dummies initialized with valid data.
     */
    static dummies<U extends AbstractModel<U>>(Model: new()=>U, count: number, customChanges: KVMap<string, any>=null): List<U>
    {
        let l = new List<U>();
        for(let idx = 0; idx < count; idx++)
            l.add(AbstractModel.dummy(Model, customChanges));
        return l;
    }

    /**
     * @override
     * @inheritdoc
     */
    equals(model: any): boolean
    {
        if(!(model instanceof AbstractModel))
            return false;
        return (this.id === model.id) && (JsTypes.belongToTheSameClass(this, model));
    }

    /**
     * Validate all properties.
     * @returns {bolean} True if valid, else false.
     */
    valid(): boolean
    {
        let valid = true;
        this._properties.foreach((propertyName, property)=>{
            if(!property.valid(this[propertyName]))
                valid = false;
        });
        return valid;
    }

    /**
     * @todo Remove this? Moved to WixDatabase?
     * Return an object holding all properties defined for this model.
     * @returns {object} The object holding the properties defined for this model.
     */
    strip(): object
    {
        return AbstractModel.strip(this);
    }

    /**
     * @todo Remove this? Moved to WixDatabase?
     * Return an object holding all properties defined for the given model.
     * @param {AbstractModel<any>} model The model to be translated.
     * @returns {object} The object holding the properties defined for the given model.
     */
    static strip<U extends AbstractModel<U>>(model: AbstractModel<U>): object
    {
        let item = {};
        model.properties.foreach((propertyName)=>{
            item[propertyName] = model[propertyName];
        });
        return item;
    }

    /**
     * Fill this model with the data from the given item.
     * @param {object} item The item containing the data.
     * @returns {ThisParameterType} This.
     */
    fill(item: object): this
    {
        if(item)
            for(let [key,value] of Object.entries(item))
                this[key] = value;
        return this;
    }

    /**
     * Get a relative.
     * @param {new()=>U, extends AbstactModel<U>} name The name of the relative.
     * @returns {U} The relative. 
     */
    protected relative<U extends AbstractModel<U>>(Relative: new()=>U): U
    {
        let relation = this.relations.get(Relative);
        if(relation)
        {
            let relative = new Relative();
            relative.previousRelative = this;
            return relative;
        }
        
        return null;
    }

    /**
     * Add a relation of 0..1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 0..1 to 1 - this has one Model.
     */
    zeroOrOneToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        // This logic inverse.

        this.relations.add(Model, new OneToZeroOrOne(Model, this.Constructor));
        this.properties.string(AbstractModel.asFk(Model));
    }

    /**
     * Add a relation of 1 to 0..1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 0..1 - this has one optional Model.
     */
    oneToZeroOrOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        // This logic inverse.

        this.relations.add(Model, new ZeroOrOneToOne(Model, this.Constructor));
    }

    /**
     * Add a relation of 1 to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to n - this has many Models.
     */
    oneToMany<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        // This logic, inverse.

        this.relations.add(Model, new ManyToOne(Model, this.Constructor));
    }
    
    /**
     * Add a relation of n to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to 1 - this belongs to one Model.
     */
    manyToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        // This logic, inverse.
        this.relations.add(Model, new OneToMany(Model, this.Constructor));
        this.properties.string(AbstractModel.asFk(Model));
    }

    /**
     * @todo
     * Add a relation of n to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to n - this belongs to many Models.
     */
    manyToMany<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        //@ts-ignore
        this.relations.add(Model, new ManyToMany(Model, this.Constructor, RoleModel));
    }

    /**
     * Assign the given model (this by default) to the given relative.
     * @param {T extends AbstractModel<T>} model The model to be assigned.
     * @param {U extends AbstractModel<U>} relative The relative the given model will be assigned to. 
     */
    assign<U extends AbstractModel<U>>(relative: U): void
    {
        AbstractModel.assign(<T><unknown>this, relative);
    }

    /**
     * Assign the given model (this by default) to the given relative.
     * @param {T extends AbstractModel<T>} model The model to be assigned.
     * @param {U extends AbstractModel<U>} relative The relative the given model will be assigned to. 
     */
    static assign<P extends AbstractModel<P>, U extends AbstractModel<U>>(model: P, relative: U): void
    {
        model.relations.get(relative.Constructor).assign(model, relative);
    }

    /**
     * Assign multiple models to the given relative.
     * @param {List<T extends AbstractModel<T>>} models The models to be assigned.
     * @param {U extends AbstractModel<U>} relative The relative the given model will be assigned to. 
     */
    assignMultiple<U extends AbstractModel<U>>(models: List<T>, relative: U): void
    {
        AbstractModel.assignMultiple(models, relative);
    }

    /**
     * Assign multiple models to the given relative.
     * @param {List<P extends AbstractModel<P>>} models The models to be assigned.
     * @param {U extends AbstractModel<U>} relative The relative the given model will be assigned to. 
     */
    static assignMultiple<P extends AbstractModel<P>, U extends AbstractModel<U>>(models: List<P>, relative: U): void
    {
        models.foreach((model)=>{AbstractModel.assign(model, relative);});
    }

    /**
     * Load the model with the data of the entity with the given id. If no id is passed, the actual id will be taken.
     * @param {string} [id] The id of the entity. 
     * @returns {Promise<this>} This. 
     */
    async load(id?: string): Promise<this>
    {
        let model = await this.get(id);
        if(model)
            return this.fill(model);
        return null;
    }

    /**
     * Get an item of the model (this by default) of the given id.
     * If called over a relative, return the item that is related to any (the first) element returned by the previous query.
     * @param {string} pk The primary key of the item to be retrieved.
     * @return {Promise<T>} The item.
     */
    async get(id?: string): Promise<T>
    {
        // Called over previous.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            let relation = this.relations.get(this.previousRelative.Constructor);
            let thisQueryResult = relation.relationalGet(previousQueryResult.first());

            return thisQueryResult;
        }

        if(!id)
            id = this.id;
        return await AbstractModel.get(id, this.Constructor);
    }

    /**
     * Get an item of the given model by the given id.
     * @param {string} pk The primary key of the item to be retrieved.  
     * @param {new()=>U} model The model of the item to be retrieved.
     * @returns {Promise<U>} The retrueved model.
     */
    static async get<U extends AbstractModel<U>>(id: string, model: new()=>U): Promise<U>
    {
        return await WixDatabase.get(id, model);
    }

    /**
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
     * If called over a relative, return only those entities that are related to the query result returned by the chained query.
     * @returns {Promise<QueryResult<T>>} The result of the executed query. 
     */
    async find(): Promise<QueryResult<T>>
    {
        // Called over previous.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            let relation = this.relations.get(this.previousRelative.Constructor);
            let thisQueryResult = await relation.relationalFind(previousQueryResult);
            
            return thisQueryResult;
        }

        return await AbstractModel.find(this.Constructor);
    }

    /**
     * Find all entities returned by the given QueryElement.
     * @param {model: new()=>U} model The QueryElement to be resolved.
     * @returns {Promise<QueryResult<<U extends AbstractModel<U>>>>} The result of the executed querry. 
     */
    static async find<U extends AbstractModel<U>>(Model: new()=>U): Promise<QueryResult<U>>
    {
        return await WixDatabase.query(Model).execute();
    }

    /**
     * Create the given model (this by default).
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model=this] The model to be created.
     */
    async create(model?: T): Promise<void>
    {
        // Called over previous.
        if(this.previousRelative)
        {
            // Nothing to do in the meaning of "assign nothing to the results of the previous query result."
            if(!model)
                return;

            // Assign the given model to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            model = this.relations.get(this.previousRelative.Constructor).assign(model, previousQueryResult.first());
        }

        // Create this.
        if(!model)
            model = <T><unknown> this;

        return await AbstractModel.create(model);
    }

    /**
     * Create a model.
     * @param {T} model The model to be created.
     */
    static async create<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        if(!model.valid())
            throw new CreateError(PATH, "AbstractModel.create()", model);

        // Call create for each relation.
        model.relations.values().foreachAsync(async(relation)=>{
            await relation.relationalCreate(model);
        });

        await WixDatabase.create(model);
    }

    /**
     * Create many models.
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship of the models in this list to the previous relative.
     * @param {List<T>} models The List containing the models to be created. 
     */
    async createMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over previous.
        if(this.previousRelative)
        {
            // Assign the given models to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            models = this.relations.get(this.previousRelative.Constructor).assignMultiple(models, previousQueryResult.first());
        }

        return await AbstractModel.createMultiple(models);
    }

    /**
     * Create many models.
     * @param {List<<U extends AbstractModel<U>>>} models The List containing the models to be created. 
     */
    static async createMultiple<U extends AbstractModel<U>>(models: List<U>): Promise<void>
    {
        if(models.isEmpty())
            return;

        models.foreach((model)=>{
            if(!model.valid())
                throw new CreateError(PATH, "AbstractModel.createMultiple()", model);
        });

        // Call save for each relation.
        models.get(0).relations.values().foreachAsync(async (relation)=>{
            await relation.relationalCreateMultiple(models);
        });

        await WixDatabase.createMultiple(models);
    }

    /**
     * Save the given model (this by default).
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model=this] The model to be saved.
     */
    async save(model?: T): Promise<void>
    {
        // Called over previous.
        if(this.previousRelative)
        {
            // Nothing to do in the meaning of "assign nothing to the results of the previous query result."
            if(!model)
                return;

            // Assign the given model to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            model = this.relations.get(this.previousRelative.Constructor).assign(model, previousQueryResult.first());
        }

        // Save this.
        if(!model)
            model = <T><unknown> this;

        return await AbstractModel.save(model);
    }

    /**
     * Save a model.
     * @param {T} model The model to be saved.
     */
    static async save<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        if(!model.valid())
            throw new SaveError(PATH, "AbstractModel.save()", model);

        // Call save for each relation.
        model.relations.values().foreachAsync(async (relation)=>{
            await relation.relationalSave(model);
        });

        await WixDatabase.save(model);
    }

    /**
     * Save many models.
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship of the models in this list to the previous relative.
     * @param {List<T>} models The List containing the models to be saved. 
     */
    async saveMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over previous.
        if(this.previousRelative)
        {
            // Assign the given models to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            models = this.relations.get(this.previousRelative.Constructor).assignMultiple(models, previousQueryResult.first());
        }

        return await AbstractModel.saveMultiple(models);
    }

    /**
     * Save many models.
     * @param {List<<U extends AbstractModel<U>>>} models The List containing the models to be saved. 
     */
    static async saveMultiple<U extends AbstractModel<U>>(models: List<U>): Promise<void>
    {
        if(models.isEmpty())
            return;

        models.foreach((model)=>{
            if(!model.valid())
                throw new SaveError(PATH, "AbstractModel.saveMultiple()", model);
        });

        // Call save for each relation.
        models.get(0).relations.values().foreachAsync(async (relation)=>{
            await relation.relationalSaveMultiple(models);
        });

        await WixDatabase.saveMultiple(models);
    }

    /**
     * Update the given model (this by default).
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model] The model to be updated.
     */
    async update(model?: T): Promise<void>
    {
        // Called over previous.
        if(this.previousRelative)
        {
            // Nothing to do in the meaning of "assign nothing to the results of the previous query result."
            if(!model)
                return;

            // Assign the given model to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            model = this.relations.get(this.previousRelative.Constructor).assign(model, previousQueryResult.first());
        }

        // Update this.
        if(!model)
            model = <T><unknown> this;

        return await AbstractModel.update(model);
    }

    /**
     * Update a model.
     * @param {<U extends AbstractModel<U>>} model The model to be updated.
     */
    static async update<U extends AbstractModel<U>>(model: U): Promise<void>
    {   
        if(!model.valid())
            throw new UpdateError(PATH, "AbstractModel.update()", model);

        // Call update for each relation.
        model.relations.values().foreachAsync(async (relation)=>{
            await relation.relationalUpdate(model);
        });

        await WixDatabase.update(model);
    }

    /**
     * Update many models.
     * If called over a relative, try to assign this model to the first retrieved model by the chained query.
     * This may not be possible depending on the relationship of the models in this list to the previous relative.
     * @param {List<T>} models The List containing the models to be updated. 
     */
    async updateMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over previous.
        if(this.previousRelative)
        {
            // Assign the given models to the previous query result.
            let previousQueryResult = await this.previousRelative.find();
            models = this.relations.get(this.previousRelative.Constructor).assignMultiple(models, previousQueryResult.first());
        }

        return await AbstractModel.updateMultiple(models);
    }

    /**
     * Update many models.
     * @param {List<<U extends AbstractModel<U>>>} models The List containing the models to be updated. 
     */
    static async updateMultiple<U extends AbstractModel<U>>(models: List<U>): Promise<void>
    {
        if(models.isEmpty())
            return;

        models.foreach((model)=>{
            if(!model.valid())
                throw new UpdateError(PATH, "AbstractModel.updateMultiple()", model);
        });

        // Call update for each relation.
        models.get(0).relations.values().foreachAsync(async (relation)=>{
            await relation.relationalUpdateMultiple(models);
        });

        await WixDatabase.updateMultiple(models);
    }

    /**
     * Destroy the given model (this by default).
     * If called over a relative, destroy all models of T that belong to the models retrieved by the previous.
     * @param {T} [model] The model to be destroyed.
     */
    async destroy(model?: T): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            // Destroy all models that belong to the models retrieved by find of the previous relative.
            if(!model)
            {
                let previousQueryResult = await this.previousRelative.find();
                let toDestroy = await this.relations.get(this.previousRelative.Constructor).relationalFind(previousQueryResult);
                
                // Continue with a single destroy if there is just one model to destroy. Else destroy multiple.
                if(toDestroy.length === 1)
                    model = toDestroy.first();
                else
                    return await AbstractModel.destroyMultiple(toDestroy);
            }
            else
            {
                // Nothing specific to do. Destroy the given model in the next step.
            }
        }

        // Destroy this.
        if(!model)
            model = <T><unknown> this;

        return await AbstractModel.destroy(model);
    }

    /**
     * Destroy a model.
     * @param {U} model The model to be destroyed.
     */
    static async destroy<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        if(!model.valid())
            throw new DestroyError(PATH, "AbstractModel.destroy()", model);

        // Call destroy for each relation.
        model.relations.values().foreachAsync(async (relation)=>{
            await relation.relationalDestroy(model);
        });

        await WixDatabase.remove(model);
    }

    /**
     * Destroy many models.
     * If called over a relative, destroy all models of T that belong to the models retrieved by the previous.
     * @param {List<T>} [models] The List containing the models to be destroyed. 
     */
    async destroyMultiple(models?: List<T>): Promise<void>
    {   
        // Called over relation.
        if(this.previousRelative)
        {
            // Destroy all models that belong to the models retrieved by find of the previous relative.
            if(!models)
            {
                let previousQueryResult = await this.previousRelative.find();
                let toDestroy = await this.relations.get(this.previousRelative.Constructor).relationalFind(previousQueryResult);
                
                // Continue with a single destroy if there is just one model to destroy. Else destroy multiple.
                if(toDestroy.length === 1)
                    return await AbstractModel.destroy(toDestroy.first());
                else
                    models = toDestroy;
            }
            else
            {
                // Nothing specific to do. Destroy the given models in the next step.
            }
        }

        return await AbstractModel.destroyMultiple(models);
    }

    /**
     * Destroy many models.
     * @param {List<<U extends AbstractModel<U>>>} models The List containing the models to be destroyed. 
     */
    static async destroyMultiple<U extends AbstractModel<U>>(models: List<U>): Promise<void>
    {
        if(models.isEmpty())
            return;

        models.foreach((model)=>{
            if(!model.valid())
                throw new DestroyError(PATH, "AbstractModel.destroyMultiple()", model);
        });

        // Call destroy for each relation.
        models.get(0).relations.values().foreachAsync(async (relation)=>{
            await relation.relationalDestroyMultiple(models);
        });

        await WixDatabase.removeMultiple(models);
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
     * @param {U extends AbstractModel<U>} Model The model the foreign key column name will be returned of.
     * @returns {string} The foreign key column name. 
     */
    static asFk<U extends AbstractModel<U>>(Model: new()=>U): string
    {
        return (new Model()).asFk();
    }

    /**
     * Get the default name of this Model as a single property.
     * @returns {string} The name of this Model as a single property.
     */
    public asSinglePropertyName(): string
    {
        return this.tableName.charAt(0).toLowerCase + this.tableName.slice(1);
    }

    /**
     * Get the default name of this Model as a multiple property.
     * @returns {string} The name of this Model as a multiple property.
     */
    public asMultiplePropertyName(): string
    {
        return this.asSinglePropertyName + "s";
    }

    /**
     * Get the name of the role table of two models named by the given names.
     * @param {string} modelName1 The name of the first model.
     * @param {string} modelName2 The name of the second model.
     * @returns {string} The name of the role table of two models named by the given names.
     */
    static roleTableNameOf(modelName1: string, modelName2: string): string
    {
        return "Role" + (modelName1.charAt(0)<modelName2.charAt(0))?modelName1 + modelName2: modelName2 + modelName1; 
    }

    static tableName<U extends AbstractModel<U>>(Model: new()=>U): string
    {
        return (new Model()).tableName;
    }

    /**
     * @todo
     * Get the table name of this model. Resolves into the name of the model/class by default.
     * @returns {string} The name of the table of this model.
     */
    get tableName(): string
    {
        return this.Constructor.name;
    }

    /**
     * Get the primary key of this model.
     * @returns {string} The primary key of this model.
     */
    get id(): string
    {
        return this._id;
    }

    get properties(): Properties
    {
        return this._properties;
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
     * Set properties.
     */
    set properties(properties: Properties)
    {
        if(!this._properties)
            this._properties = new Properties();
        properties.foreach((propertyName, property)=>{this._properties.add(propertyName, property);});
    }

    /**
     * Set previous relative.
     * @param {AbstractModel<any>} relative The previous relative.
     */
    private set previousRelative(relative: AbstractModel<any>)
    {
        this._previousRelative = relative;
    }

    /**
     * Get previous relative.
     * @returns {AbstractModel<any>} The previous relative.
     */
    private get previousRelative(): AbstractModel<any>
    {
        return this._previousRelative;
    }

    /**
     * Set all relations of this model.
     * @param {KVMap<new()=>AbstractModel<any>, Relation<new()=>AbstractModel<any>, new()=>T>>} relations The relations.
     */
    private set relations(relations: KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>)
    {
        this._relations = relations;
    }

    /**
     * Get all relations of this model.
     * @returns {KVMap<AbstractModel<any>, Relation<AbstractModel<any>, T>>} The relations.
     */
    private get relations(): KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>
    {
        return this._relations;
    }
}



export class Properties extends KVMap<string,Property>
{
    constructor()
    {
        super();
    }

    string(name: string, ...attributes: Array<string>): this
    {
        let property = new StringProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }

    number(name: string, ...attributes: Array<string>): this
    {
        let property = new NumberProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }
}


export abstract class Property
{
    protected validAttributes: Set<string>;
    protected _attributes: Set<string>;

    constructor()
    {
        this.validAttributes = new Set<string>([
            "nullable"
        ]);
        
        this.attributes = new Set<string>();
    }

    valid(toCheck: any): boolean
    {
        if(JsTypes.isUnspecified(toCheck))
            if(!this.attributes.has("nullable"))
                return false;
        return true;
    }

    abstract dummy(): any

    set attributes(attributes: Set<string>)
    {
        this._attributes = new Set<string>();

        attributes.foreach((attribute)=>{
            if(this.validAttributes.has(attribute))
                this._attributes.add(attribute);    
            else
                throw new InvalidOperationError(PATH, "Property.set attributes()", "The attribute " + attribute + " doesn't exist.");            
        });
    }

    get attributes(): Set<string>
    {
        return this._attributes;
    }
}

export class StringProperty extends Property
{
    constructor(attributes: Set<string>)
    {
        super();
        
        this.validAttributes.addMultiple([
            "emtiable"
        ]);

        this.attributes = attributes;
    }
    
    valid(toCheck: any): boolean
    {
        if(!super.valid(toCheck))
            return false;

        if(typeof(toCheck) !== "string")
            return false;

        if(JsTypes.isEmpty(toCheck) && this.attributes.hasNot("emptiable"))
            return false;

        return true;
    }

    dummy(): string
    {
        return UUID();
    }
}

export class NumberProperty extends Property
{
    constructor(attributes: Set<string>)
    {
        super();
        this.validAttributes.addMultiple([
            "negative",
            "positive",
            "notZero"
        ]);

        this.attributes = attributes;
    }

    valid(toCheck: any): boolean
    {
        if(!super.valid(toCheck))
            return false;

        if(typeof(toCheck) !== "number")
            return false;

        if(this.attributes.has("negative") && toCheck > 0)
            return false;

        if(this.attributes.has("positive") && toCheck < 0)
            return false;

        if(this.attributes.has("notZero") && toCheck === 0)
            return false;
        
        return true;
    }

    dummy() 
    {
        let n = Math.random() * 100;
        
        if(this.attributes.has("negative"))
            n = -n;

        if(this.attributes.has("notZero"))
            if(n === 0)
                n += 1;

        return n;
    }
}


/**
 * @class
 * A class representing a dummy model for accessing the role table of two other models.
 */
export class RoleModel extends AbstractModel<RoleModel> implements IComparable
{
    private _model1: AbstractModel<any>;
    private _model2: AbstractModel<any>;
    //@ts-ignore
    protected Constructor: new () => RoleModel = RoleModel;
    /**
     * Create a dummy RoleModel for accessing the role table of the given two models.
     * @param {AbstractModel<any>} model1 A model.
     * @param {AbstractModel<any>} model2 Another model.
     */
    constructor(model1: AbstractModel<any>, model2: AbstractModel<any>)
    {
        super();
        this.model1 = model1;
        this.model2 = model2;
        this[model1.asFk()] = model1.id;
        this[model2.asFk()] = model2.id;

        this.properties.
        string(this.model1.asFk()).
        string(this.model2.asFk());
    }

    init(): void 
    {

    }

    addProperties(): void 
    {
        
    }

    /**
     * @override
     * @inheritdoc
     */
    equals(roleModel: any): boolean
    {
        if(!(roleModel instanceof RoleModel))
            return false;
        if(this.hasReference(roleModel.model1) && this.hasReference(roleModel.model2))
            return true;
        return false;
    }

    /**
     * Check if this role model refers to the given model.
     * @param {AbstractModel<any>} model The model this RoleModel is maybe referring to.
     * @return {boolean} True if this model refers to the given model, else false. 
     */
    hasReference(model: AbstractModel<any>): boolean
    {
        if(this.model1.constructor === model.constructor && this.model1.id === model.id)
            return true;
        if(this.model2.constructor === model.constructor && this.model2.id === model.id)
            return true;
        return false;
    }

    /**
     * @overrride
     * @inheritdoc
     */
    addRelations(): void 
    {
        // Nothing to add.
    }

    /**
     * @override
     * @inheritdoc
     */
    get tableName(): string
    {
        return AbstractModel.roleTableNameOf(this.model1.tableName, this.model2.tableName);
    }

    /**
     * Get the first model this RoleTable refers to.
     * @returns {AbstractModel<any>} The first model this RoleModel refers to.
     */
    get model1(): AbstractModel<any>
    {
        return this._model1;
    }

    /**
     * Get the second model this RoleTable refers to.
     * @returns {AbstractModel<any>} The second model this RoleModel refers to.
     */
    get model2(): AbstractModel<any>
    {
        return this._model2;
    }

    /**
     * Set the first model this RoleTable refers to.
     * @param {AbstractModel<any>} model The first model this RoleModel refers to.
     */
    set model1(model: AbstractModel<any>)
    {
        this._model1 = model;
    }

    /**
     * Set the second model this RoleTable refers to.
     * @param {AbstractModel<any>} model The second model this RoleModel refers to.
     */
    set model2(model: AbstractModel<any>)
    {
        this._model2 = model;
    }
}

export default AbstractModel;