const PATH = "public/src/main/common/AbstractModel.js";
import wixData from "wix-data"


import IComparable from "public/src/main/common/util/IComparable.js"
import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import KVMap from "./util/collections/map/KVMap";
import NotImplementedError from "./util/error/NotImplementedError";
import Associations from "./Associations";
import List from "./util/collections/list/List";
import OneToOne from "public/src/main/common/OneToOne.js"
import Root from "./Root";
import QueryElement from "./QueryElement";
import ShoppingCart from "../feature/shoppingCart/model/ShoppingCart";
import OneToMany from "./OneToMany";
import ManyToMany from "./ManyToMany";
import ManyToOne from "./ManyToOne";
import QueryResult from "./QueryResult";
import RoleModel from "./RoleModel";

/**
 * @todo PUT STATIC METHODS SOMEWHERE ELSE?
 * @todo Refactoring, where to put "to table name" etc.
 * @todo rename _tmpQuery
 * @todo asPk() maybe to getter get pkColumnName/pkName?
 * @todo Get, get many, get where ...
 */

/**
 * @class
 * A class representing an abstract model.
 */

 type P = AbstractModel<P>
abstract class AbstractModel<T extends AbstractModel<T>> extends AbstractEntity implements IComparable<AbstractModel<any>>
{
    static tableName: string = "AbstractModel";
    private _currentQuery: QueryElement<P,T>;
    private _relations: KVMap<P, QueryElement<P, T>>; 

    /**
     * Create an Abstract Model.
     * All classes that deriver from Abstract Model need to define their own static tableName attribute.
     * @param {string} id The id of this entity.
     */
    constructor(id: string=null, a:string)
    {
        super(id);
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

    /*
    private saveCreate(data: object=null): T
    {
        let model = this.create(data);
        model.currentQuery = new Root<T>(model);
        return model;
    }
    */

    /**
     * Create an new model and fill it with data.
     * @param {object} data An object containing the data for fill the new model with the given information.
     * @return {T} An new model. 
     */
    create(data: object=null): T
    {
        let model = this.newInstance();
        model.currentQuery = new Root<T>(model);
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
            relative.currentQuery.previous = this.currentQuery;
            return relative;
        }
        
        return null;
    }

    /**
     * Perform all necessary operations in order to chain a new QueryElement to the actual query.
     * @param {QueryElement<U>} queryElement The new query element.
     * @returns {U} An instance of the model the new query refers to.
     */
    private chainQueryElement<U extends AbstractModel<U>>(queryElement: QueryElement<T, U>): U
    {
        queryElement.previous = this.currentQuery;
        queryElement.memberB.currentQuery = queryElement;
        return queryElement.memberB;
    }

    /**
     * Query an associated object of 1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 1 - this hasOne Model.
     * @returns {Promise<U>} The associated Model.
     */
    oneToOne<U extends AbstractModel<U>>(Model: {new(): U}): U
    {
        return this.chainQueryElement(new OneToOne(this.newInstance(), new Model()));
    }

    /**
     * Query the associated objects of 1 to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to n - this has many Models.
     * @returns {Promise<List<U>>} The associated Models.
     */
    oneToMany<U extends AbstractModel<U>>(Model: {new(): U}): U
    {
        return this.chainQueryElement(new OneToMany(this.newInstance(), new Model()));
    }
    
    /**
     * Query the associated object of n to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to 1 - this belongs to one Model.
     * @returns {Promise<U>} The associated Model.
     */
    manyToOne<U extends AbstractModel<U>>(Model: {new(): U}): U
    {
        return this.chainQueryElement(new ManyToOne(this.newInstance(), new Model()));
    }

    /**
     * Query the associated objects of n to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to n - this belongs to many Models.
     * @returns {Promise<List<U>>} The associated Models.
     */
    manyToMany<U extends AbstractModel<U>>(Model: {new(): U}): U
    {
        return this.chainQueryElement(new ManyToMany(this.newInstance(), new Model()));
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
     * @param {QueryElement} [queryElement=this.currentQuery] The QueryElement to be resolved.
     * @returns {Promise<QueryResult<T>>} The result of the executed querry. 
     */
    async find(): Promise<QueryResult<T>>
    {
        return await AbstractModel.find(this.currentQuery);
    }

    /**
     * Find all entities returned by the given QueryElement.
     * @param {QueryElement} queryElement The QueryElement to be resolved.
     * @returns {Promise<QueryResult<T>>} The result of the executed querry. 
     */
    static async find<A extends AbstractModel<A>, B extends AbstractModel<B>>(queryElement: QueryElement<A,B>): Promise<QueryResult<B>>
    {
        return await queryElement.find();
    }

    /**
     * Save the given model (this by default).
     * @param {AbstractModel<T>} [model=this] The model to be saved.
     */
    async save(model: AbstractModel<T>=this): Promise<void>
    {
        await this.currentQuery.relationalSave(model);
    }

    /**
     * Save a model.
     * @param {AbstractModel<T>} model The model to be saved.
     */
    static async save<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.save(model.tableName, model);
    }

    /**
     * Update many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be saved. 
     */
    async saveMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.saveMany(models);
    }

    /**
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
     * Update a model.
     * @param {AbstractModel<U extends AbstractModel<U>>} model The model to be updated.
     */
    static async update<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.update(this.tableName, model);
    }

    /**
     * Update many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be updated. 
     */
    async updateMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.updateMany(models);
    }

    /**
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
     * Destroy the given model (this by default).
     * @param {AbstractModel<T>} [model=this] The model to be destroyed.
     */
    async destroy(model: AbstractModel<T>=this): Promise<void>
    {
        // Destroy called over a chain of QueryResults. Destroy all results.
        if(!this.currentQuery.previous)
        {
            let queryResults = await this.currentQuery.find();
            this.relations.foreach(async (relation)=>{await relation.destroyMany(queryResults.items);});
        }
        // Default destroy of the given model. 
        // Destroy function of each relation updates the affected references and destroys referenced objects if necessary.
        else
            this.relations.foreach(async (relation)=>{await relation.destroy(model);});
    }

    /**
     * Destroy a model.
     * @param {AbstractModel<U extends AbstractModel<U>>} model The model to be destroyed.
     */
    static async destroy<U extends AbstractModel<U>>(model: AbstractModel<U>): Promise<void>
    {
        await wixData.delete(model.tableName, model.id);
    }

    /**
     * Destroy many models.
     * @param {List<AbstractModel<T>>} models The List containing the models to be destroyed. 
     */
    async destroyMany(models: List<AbstractModel<T>>): Promise<void>
    {
        return await AbstractModel.destroyMany(models);
    }

    /**
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
     * Get the tale name of this model. Resolves into the name of the model by default.
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

    /*
    private resetCurrentQuery()
    {
        //this.currentQuery = new Root<T>(this.create(this));
        this.currentQuery = new Root<T>(this);
    }
    */

    /**
     * Set the name of the primary key column name of this model.
     * @param {string} pk The new primary key.
     */
    set pk(pk: string)
    {
        this.id = pk;
    }

    /**
     * Set CurrentQuery.
     * @param {QueryElement<T>} query The new current QueryElement.
     */
    private set currentQuery(query: QueryElement<P,T>)
    {
        this._currentQuery = query;
    }

    /**
     * Get CurrentQuery.
     * @returns {QueryElement<T>} The current QueryElement.
     */
    private get currentQuery(): QueryElement<P,T>
    {
        return this._currentQuery;
    }

    private set relations(relations: KVMap<P, QueryElement<P,T>>)
    {
        this._relations = relations;
    }

    private get relations(): KVMap<P, QueryElement<P,T>>
    {
        return this._relations;
    }

}

export default AbstractModel;

	