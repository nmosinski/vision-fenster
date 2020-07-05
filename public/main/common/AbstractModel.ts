const PATH = "public/main/common/AbstractModel.js";

import WixDatabase from "public/main/common/WixDatabase.js"
import IComparable from "public/main/common/util/IComparable.js"
import AbstractEntity from "public/main/common/AbstractEntity.js"
import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"
import KVMap from "public/main/common/util/collections/map/KVMap";
import List from "public/main/common/util/collections/list/List";
import OneToOne from "public/main/common/OneToOne.js"
import Relation from "public/main/common/Relation.js";
import OneToMany from "public/main/common/OneToMany";
import ManyToMany from "public/main/common/ManyToMany";
import ManyToOne from "public/main/common/ManyToOne";
import QueryResult from "public/main/common/QueryResult";

/**
 * @todo Add undo operations for save etc. Important in case a save is not possible but uve updated already some references.
 */

/**
 * @class
 * A class representing an abstract model.
 */

abstract class AbstractModel<T extends AbstractModel<T>> extends AbstractEntity implements IComparable
{
    private _previousRelative: AbstractModel<any>;
    private _relations: KVMap<AbstractModel<any>, Relation<AbstractModel<any>, T>>; 

    /**
     * Create an Abstract Model.
     * All classes that deriver from Abstract Model need to define their own static tableName attribute.
     * @param {string} id The id of this entity.
     */
    constructor(id: string=null)
    {
        super(id);
        this.previousRelative = null;
        this.addRelations();
    }

    /**
     * Save all relations of this model.
     */
    abstract addRelations(): void;

    /**
     * @abstract
     * Create a new Instance of itself.
     * @return {T} A new instance of itself.
     */
    abstract newInstance():T;

    /**
     * @override
     * @inheritdoc
     */
    equals(model: any): boolean
    {
        if(!(model instanceof AbstractModel))
            return false;
        return (this.pk === model.pk) && (JsTypes.belongToTheSameClass(this, model));
    }

    /**
     * Create an new model and fill it with data.
     * @param {object} data An object containing the data for fill the new model with the given information.
     * @return {T} An new model. 
     */
    create(data: object=null): T
    {
        let model = this.newInstance();
        model.fill(data);
        return model;
    }

    /**
     * Fill this model with the data from the given item.
     * @param {object} item The item containing the data.
     * @returns {ThisParameterType} This.
     */
    fill(item: object): this
    {
        for(let [key,value] of Object.entries(item))
            this[key] = value;
        return this;
    }

    /**
     * Get a relative.
     * @param {U extends AbstactModel<U>} name The name of the relative.
     * @returns {U} The relative. 
     */
    protected relative<U extends AbstractModel<U>>(relative: U): U
    {
        let r = this.relations.get(relative);
        if(r)
        {
            relative.previousRelative = this;
            return relative;
        }
        
        return null;
    }

    /**
     * Add a relation of 1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 1 - this hasOne Model.
     */
    oneToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        this.relations.add(new Model(), new OneToOne(new Model(), this.newInstance()));
    }

    /**
     * Add a relation of 1 to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to n - this has many Models.
     */
    oneToMany<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        this.relations.add(new Model(), new OneToMany(new Model(), this.newInstance()));
    }
    
    /**
     * Add a relation of n to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to 1 - this belongs to one Model.
     */
    manyToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        this.relations.add(new Model(), new ManyToOne(new Model(), this.newInstance()));
    }

    /**
     * Add a relation of n to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to n - this belongs to many Models.
     */
    manyToMany<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        this.relations.add(new Model(), new ManyToMany(new Model(), this.newInstance()));
    }

    /**
     * Load the model with the data of the entity with the given id.
     * @param {string} id The id of the entity.
     * @returns {Promise<this>} This. 
     */
    async load(id: string): Promise<this>
    {
        let model = await this.get(id);
        this.fill(model);
        return this;
    }

    /**
     * Get an item of the model (this by default) of the given id.
     * If called over a relative, return only an item if the given item is related to at least one of the items returned by the previous query.
     * @param {string} pk The primary key of the item to be retrieved.
     * @return {Promise<T>} The item.
     */
    async get(id: string): Promise<T>
    {
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            return await this.relations.get(this.previousRelative).relationalGet(previousQueryResult);
        }

        return await AbstractModel.get(id, this.newInstance());
    }

    /**
     * Get an item of the given model by the given id.
     * @param {string} pk The primary key of the item to be retrieved.  
     * @param {Promise<U>} model The model of the item to be retrieved. 
     */
    static async get<U extends AbstractModel<U>>(id: string, model: U): Promise<U>
    {
        return await WixDatabase.get(id, model);
    }

    /**
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
     * If called over a relative, return only those entities that are related to the query result returned by the chained query.
     * @param {Relation} [queryElement=this.currentQuery] The QueryElement to be resolved.
     * @returns {Promise<QueryResult<T>>} The result of the executed querry. 
     */
    async find(): Promise<QueryResult<T>>
    {
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            return await this.relations.get(this.previousRelative).relationalFind(previousQueryResult);
        }

        return await AbstractModel.find(this.newInstance());
    }

    /**
     * Find all entities returned by the given QueryElement.
     * @param {Relation} queryElement The QueryElement to be resolved.
     * @returns {Promise<QueryResult<<U extends AbstractModel<U>>>>} The result of the executed querry. 
     */
    static async find<U extends AbstractModel<U>>(model: U): Promise<QueryResult<U>>
    {
        return await WixDatabase.query(model).execute();
    }

    /**
     * Save the given model (this by default).
     * If called over a relative, try to assign this model to the retrieved models by the chained query.
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model=null] The model to be saved.
     */
    async save(model: T=this.create(this)): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalSave(model, previousQueryResult);
        }

        return await AbstractModel.save(model);
    }

    /**
     * Save a model.
     * @param {T} model The model to be saved.
     */
    static async save<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        model.relations.foreach(async (m, rel)=>{await rel.relationalSave(model, null);});
        await WixDatabase.save(model);
    }

    /**
     * Save many models.
     * If called over a relative, try to assign all of the given models to the items returned by the chained query.
     * This may not be possible depending on the relationship of the models in this list to the previous relative.
     * @param {List<T>} models The List containing the models to be saved. 
     */
    async saveMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalSaveMultiple(models, previousQueryResult);
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

        models.get(0).relations.foreach(async (m, rel)=>{await rel.relationalSaveMultiple(models, null);});
        await WixDatabase.saveMultiple(models);
    }

    /**
     * Update the given model (this by default).
     * If called over a relative, try to assign this model to the retrieved models by the chained query. 
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model=this] The model to be updated.
     */
    async update(model: T=this.create(this)): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalUpdate(model, previousQueryResult);
        }

        return await AbstractModel.update(model);
    }

    /**
     * Update a model.
     * @param {<U extends AbstractModel<U>>} model The model to be updated.
     */
    static async update<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        model.relations.foreach(async (m, rel)=>{await rel.relationalUpdate(model, null);});
        await WixDatabase.update(model);
    }

    /**
     * Update many models.
     * If called over a relative, try to assign all of the given models to the items returned by the chained query.
     * This may not be possible depending on the relationship of the models in this list to the previous relative.
     * @param {List<T>} models The List containing the models to be updated. 
     */
    async updateMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalUpdateMultiple(models, previousQueryResult);
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

        models.get(0).relations.foreach(async (m, rel)=>{await rel.relationalUpdateMultiple(models, null);});
        await WixDatabase.updateMultiple(models);
    }

    /**
     * Destroy the given model (this by default).
     * If called over a relative, destroy all models retrieved by the chained query.
     * @param {T} [model=this] The model to be destroyed.
     */
    async destroy(model: T=this.create(this)): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalDestroy(model, previousQueryResult);
        }

        return await AbstractModel.destroy(model);
    }

    /**
     * Destroy a model.
     * @param {U} model The model to be destroyed.
     */
    static async destroy<U extends AbstractModel<U>>(model: U): Promise<void>
    {
        model.relations.foreach(async (m, rel)=>{await rel.relationalDestroy(model, null);});
        await WixDatabase.remove(model);
    }

    /**
     * Destroy many models.
     * If called oveer a relative, destroy all models retrieved by the chained query.
     * @param {List<T>} models The List containing the models to be destroyed. 
     */
    async destroyMultiple(models: List<T>): Promise<void>
    {
        if(models.isEmpty())
            return;
        
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative).relationalDestroyMultiple(models, previousQueryResult);
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

        models.get(0).relations.foreach(async (m, rel)=>{await rel.relationalDestroyMultiple(models, null);});
        await WixDatabase.removeMultiple(models);
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
     * Get the primary key column name of this model.
     * @returns {string} The primary key column name.
     */
    public asPk(): string
    {
        return "_id";
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

    /**
     * @todo
     * Get the table name of this model. Resolves into the name of the model/class by default.
     * @returns {string} The name of the table of this model.
     */
    get tableName(): string
    {
        return this.constructor["tableName"];
    }

    /**
     * Get the primary key of this model.
     * @returns {string} The primary key of this model.
     */
    get pk(): string
    {
        return this.id;
    }

    /**
     * Set the primary key of this model.
     * @param {string} pk The new primary key.
     */
    set pk(pk: string)
    {
        this.id = pk;
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
     * @param {KVMap<AbstractModel<any>, Relation<AbstractModel<any>, T>>} relations The relations.
     */
    private set relations(relations: KVMap<AbstractModel<any>, Relation<AbstractModel<any>,T>>)
    {
        this._relations = relations;
    }

    /**
     * Get all relations of this model.
     * @returns {KVMap<AbstractModel<any>, Relation<AbstractModel<any>, T>>} The relations.
     */
    private get relations(): KVMap<AbstractModel<any>, Relation<AbstractModel<any>,T>>
    {
        return this._relations;
    }

}

export default AbstractModel;