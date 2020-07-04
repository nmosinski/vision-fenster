const PATH = "public/src/main/common/AbstractModel.js";

import IComparable from "public/src/main/common/util/IComparable.js"
import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import KVMap from "./util/collections/map/KVMap";
import List from "./util/collections/list/List";
import OneToOne from "public/src/main/common/OneToOne.js"
import Relation from "./Relation.js";
import OneToMany from "./OneToMany";
import ManyToMany from "./ManyToMany";
import ManyToOne from "./ManyToOne";
import QueryResult from "./QueryResult";
import Query from "./Query";

/**
 * @class
 * A class representing an abstract model.
 */

abstract class AbstractModel<T extends AbstractModel<T>> extends AbstractEntity implements IComparable<AbstractModel<any>>
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
    equals(model: AbstractModel<any>): boolean
    {
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
     * @returns {this} This. 
     */
    async load(id: string): Promise<this>
    {
        let model = await this.get(id);
        this.fill(model);
        return this;
    }

    /**
     * @todo
     * Get an item of the model (this by default) of the given id.
     * @param {string} pk The primary key of the item to be retrieved.
     * @param {AbstractModel<T>} [model=this] The model to be retrieved.
     */
    async get(id: string, model: AbstractModel<T>=this): Promise<T>
    {
        let item = await wixData.get(model.tableName, id);
        let ret = this.create(item);
        return ret;
    }

    /**
     * @todo
     * Get an item of the given model by the given id.
     * @param {string} pk The primary key of the item to be retrieved.  
     * @param {U} model The model of the item to be retrieved. 
     */
    static async get<U extends AbstractModel<U>>(id: string, model: AbstractModel<U>): Promise<U>
    {
        let item = await wixData.get(model.tableName, id);
        let ret = model.create(item);
        return ret;
    }

    /**
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
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
     * @returns {Promise<QueryResult<T>>} The result of the executed querry. 
     */
    static async find<U extends AbstractModel<U>>(model: U): Promise<QueryResult<U>>
    {
        let query = new Query<U>(model);
        return await query.execute();
    }

    /**
     * @todo
     * Save the given model (this by default).
     * @param {AbstractModel<T>} [model=this] The model to be saved.
     */
    async save(model: AbstractModel<T>=this): Promise<void>
    {
        await this.previousRelative.relationalSave(model);
    }

    /**
     * @todo
     * Save a model.
     * @param {AbstractModel<T>} model The model to be saved.
     */
    static async save<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.save(model.tableName, model);
    }

    /**
     * @todo
     * Update many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be saved. 
     */
    async saveMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.saveMany(models);
    }

    /**
     * @todo
     * Save many models.
     * @param {List<AbstractModel<U extends AbstractModel<U>>>} models The List containing the models to be saved. 
     */
    static async saveMany<U extends AbstractModel<U>>(models: List<AbstractModel<U>>): Promise<void>
    {
        if(models.isEmpty())
            return;
        await wixData.bulkSave(models.get(0).tableName, models.toArray());
    }

    /**
     * @todo
     * Update the given model (this by default).
     * @param {AbstractModel<T>} [model=this] The model to be updated.
     */
    async update(model: AbstractModel<T>=this): Promise<void>
    {
        /*
        await this.currentQuery.assign(model);
        this.relations.foreach((rel)=>{rel.update(model);});
        */
    }

    /**
     * @todo
     * Update a model.
     * @param {AbstractModel<U extends AbstractModel<U>>} model The model to be updated.
     */
    static async update<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.update(this.tableName, model);
    }

    /**
     * @todo
     * Update many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be updated. 
     */
    async updateMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.updateMany(models);
    }

    /**
     * @todo
     * Update many models.
     * @param {List<AbstractModel<U extends AbstractModel<U>>>} models The List containing the models to be updated. 
     */
    static async updateMany<U extends AbstractModel<U>>(models: List<AbstractModel<U>>): Promise<void>
    {
        if(models.isEmpty())
            return;
        await wixData.bulkUpdate(models.get(0).tableName, models.toArray());
    }

    /**
     * @todo
     * Destroy the given model (this by default).
     * @param {AbstractModel<T>} [model=this] The model to be destroyed.
     */
    async destroy(model: AbstractModel<T>=this): Promise<void>
    {
        // Destroy called over a chain of QueryResults. Destroy all results.
        if(!this.previousRelative.previous)
        {
            let queryResults = await this.previousRelative.find();
            this.relations.foreach(async (relation)=>{await relation.destroyMany(queryResults.items);});
        }
        // Default destroy of the given model. 
        // Destroy function of each relation updates the affected references and destroys referenced objects if necessary.
        else
            this.relations.foreach(async (relation)=>{await relation.destroy(model);});
    }

    /**
     * @todo
     * Destroy a model.
     * @param {AbstractModel<U extends AbstractModel<U>>} model The model to be destroyed.
     */
    static async destroy<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.delete(model.tableName, model.id);
    }

    /**
     * @todo
     * Destroy many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be destroyed. 
     */
    async destroyMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.destroyMany(models);
    }

    /**
     * @todo
     * Destroy many models.
     * @param {List<AbstractModel<U extends AbstractModel<U>>>} models The List containing the models to be destroyed. 
     */
    static async destroyMany<U extends AbstractModel<U>>(models: List<AbstractModel<U>>): Promise<void>
    {
        if(models.isEmpty())
            return;
        await wixData.bulkDelete(models.get(0).tableName, models.toArray());
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

	