const PATH = "public/main/common/AbstractModel.js";

import AbstractEntity from "public/main/common/AbstractEntity.js"
import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"
import KVMap from "public/main/common/util/collections/map/KVMap.js";
import List from "public/main/common/util/collections/list/List.js";
import Set from "public/main/common/util/collections/set/Set.js";

import WixDatabase from "public/main/common/WixDatabase.js"
import IComparable from "public/main/common/util/IComparable.js"
import OneToZeroOrOne from "public/main/common/ZeroOrOneToOne.js"
import ZeroOrOneToOne from "public/main/common/OneToZeroOrOne.js"
import OneToOne from "public/main/common/OneToOne.js"
import Relation from "public/main/common/Relation.js";
import OneToMany from "public/main/common/OneToMany.js";
import ManyToMany from "public/main/common/ManyToMany.js";
import ManyToOne from "public/main/common/ManyToOne.js";
import QueryResult from "public/main/common/QueryResult.js";
import InvalidOperationError from "./util/error/InvalidOperationError";

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
    private _relations: KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>;
    protected abstract Constructor: new()=>T;
    protected _properties: Properties;

    /**
     * Create an Abstract Model.
     * All classes that deriver from Abstract Model need to define their own static tableName attribute.
     * @param {string} id The id of this entity.
     */
    constructor(id: string|any=null)
    {
        super((JsTypes.isString(id))?id:null);
        
        if(JsTypes.isObject(id))
            this.fill(id);

        this.previousRelative = null;
        this.relations = new KVMap<new()=>AbstractModel<any>, Relation<AbstractModel<any>,T>>();
        this.addRelations();

        this._properties = new Properties();
    }

    /**
     * Get a new instance of this.
     * @returns {T} A new instance.
     */
    instance(): T
    {
        return new this.Constructor();       
    }


    /**
     * Save all relations of this model.
     */
    abstract addRelations(): void;

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
     * Validate all properties.
     * @returns {bolean} True if valid, else false.
     */
    validate(): boolean
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
        model._properties.foreach((propertyName)=>{
            item[propertyName] = model[propertyName];
            item["_id"] = model.id;
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
    zeroOroneToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        // This logic inverse.
        this.relations.add(Model, new OneToZeroOrOne(Model, this.Constructor));
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
     * Add a relation of 1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 1 - this hasOne Model.
     */
    oneToOne<U extends AbstractModel<U>>(Model: {new(): U}): void
    {
        this.relations.add(Model, new OneToOne(Model, this.Constructor));
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
     * Load the model with the data of the entity with the given id.
     * @param {string} id The id of the entity.
     * @returns {Promise<this>} This. 
     */
    async load(id: string): Promise<this>
    {
        let model = await this.get(id);
        return this.fill(model);
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
            return await this.relations.get(this.previousRelative.Constructor).relationalGet(previousQueryResult);
        }

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
     * @todo Remove previous after query.
     * @todo Save last query / dynamic property in the root.
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
     * If called over a relative, return only those entities that are related to the query result returned by the chained query.
     * @returns {Promise<QueryResult<T>>} The result of the executed querry. 
     */
    async find(): Promise<QueryResult<T>>
    {
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            return await this.relations.get(this.previousRelative.Constructor).relationalFind(previousQueryResult);
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
     * Save the given model (this by default).
     * If called over a relative, try to assign this model to the retrieved models by the chained query.
     * This may not be possible depending on the relationship to the previous relative.
     * @param {T} [model=this] The model to be saved.
     */
    async save(model: T=<T><unknown>this): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative.Constructor).relationalSave(model, previousQueryResult);
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
            await this.relations.get(this.previousRelative.Constructor).relationalSaveMultiple(models, previousQueryResult);
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
    async update(model: T=<T><unknown>this): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative.Constructor).relationalUpdate(model, previousQueryResult);
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
            await this.relations.get(this.previousRelative.Constructor).relationalUpdateMultiple(models, previousQueryResult);
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
    async destroy(model: T=<T><unknown>this): Promise<void>
    {
        // Called over relation.
        if(this.previousRelative)
        {
            let previousQueryResult = await this.previousRelative.find();
            await this.relations.get(this.previousRelative.Constructor).relationalDestroy(model, previousQueryResult);
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
            await this.relations.get(this.previousRelative.Constructor).relationalDestroyMultiple(models, previousQueryResult);
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
        return this.Constructor.name;
    }

    /**
     * Get the primary key of this model.
     * @returns {string} The primary key of this model.
     */
    get pk(): string
    {
        return this.id;
    }

    get properties(): Properties
    {
        return this._properties;
    }

    /**
     * Set the primary key of this model.
     * @param {string} pk The new primary key.
     */
    set pk(pk: string)
    {
        this.id = pk;
    }

    set properties(properties: Properties)
    {
        this._properties = properties;
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
        let property = new Property("string", attributes);
        this.add(name, property);
        return this;
    }

    number(name: string, ...attributes: Array<string>): this
    {
        let property = new Property("number", attributes);
        this.add(name, property);
        return this;
    }
}


export class Property
{
    validAttributes = new Set<string>([
        "nullable",
        "emptiable",
    ]);

    validTypes = new Set<string>([
        "string",
        "number",
        "unspecified"
    ]);

    private _value: any;
    private _type: string;
    private _attributes: Set<string>;

    constructor(type: string, attributesArray: Array<string>)
    {
        this.type = type;
        this.attributes = new Set<string>(attributesArray);
    }

    valid(toCheck: any)
    {
        if(JsTypes.isUnspecified(toCheck))
        {
            if(!this.attributes.has("nullable"))
                return false;
            return true;
        }

        if(typeof(toCheck) !== this.type)
            return false;

        if(JsTypes.isEmpty(toCheck) && this.attributes.hasNot("emptiable"))
            return false;

        return true;
    }

    set type(type: string)
    {
        this._type = type;
    }

    get type(): string
    {
        return this._type;
    }

    set attributes(attributes: Set<string>)
    {
        this._attributes = new Set<string>();

        attributes.foreach((attribute)=>{
            if(!this.validAttributes.has(attribute))
                throw new InvalidOperationError(PATH, "Property.set attributes()", "The attribute " + attribute + " doesn't exist.");
            else
                this._attributes.add(attribute);
        });
    }

    get attributes(): Set<string>
    {
        return this._attributes;
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
        this[model1.asFk()] = model1.pk;
        this[model2.asFk()] = model2.pk;
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
        if(this.model1.constructor === model.constructor && this.model1.pk === model.pk)
            return true;
        if(this.model2.constructor === model.constructor && this.model2.pk === model.pk)
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