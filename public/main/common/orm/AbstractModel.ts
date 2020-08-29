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
import WixDatabase, { Query } from './WixDatabase';
import QueryResult from './QueryResult';
import ManyToMany from './ManyToMany';
import CreateError from './CreateError';
import SaveError from './SaveError';
import UpdateError from './UpdateError';
import DestroyError from './DestroyError';
import InvalidOperationError from '../util/error/InvalidOperationError';
import AHoldsReferenceToB from './AHoldsReferenceToB.js';
import AHoldsNoReferenceToB from './AHoldsNoReferenceToB.js';
import NullPointerException from '../util/error/NullPointerException.js';
import type { AnyNumber } from "../util/supportive";

/**
 * @todo Add undo operations for save etc. Important in case a save is not possible but uve updated already some references.
 */

/**
 * @class
 * A class representing an abstract model.
 */

abstract class AbstractModel<T extends AbstractModel<T>> implements IComparable {
    private _parent: AbstractModel<any>;
    private _relations: KVMap<new () => AbstractModel<any>, Relation<AbstractModel<any>, T>>;
    protected abstract Constructor: new () => T;
    protected _properties: Properties;
    private _id: string;
    private _lastQueryResult: QueryResult<T> | AbstractModel<T>;

    /**
     * Create an Abstract Model.
     */
    constructor(data?: object) {
        this.relations = new KVMap<new () => AbstractModel<any>, Relation<AbstractModel<any>, T>>();
        this.properties = new Properties();

        this.properties.
            string("id");

        this.init();
        this.addProperties();
        this.addRelations();
        if (data)
            this.fill(data);
    }

    abstract init(): void;

    /**
     * Get a new instance of this.
     * @returns {T} A new instance.
     */
    instance(): T {
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
    static dummy<U extends AbstractModel<U>>(Model: new () => U, customChanges?: KVMap<string, any>): U {
        let t = new Model();
        let item = {};

        t.properties.foreach((propertyName, property) => { item[propertyName] = property.dummy(); });
        t = t.fill(item);

        if (customChanges)
            customChanges.foreach((propertyname, value) => { t[propertyname] = value; });
        return t;
    }

    /**
     * Get multiple instances of a dummy of this model.
     * @param {U extends AbstractModel<U>} Model The model of which duummies will be created.
     * @param {number} count The amount of dummies to be created.
     * @returns {List<T>} A list containing the given amount of dummies initialized with valid data.
     */
    static dummies<U extends AbstractModel<U>>(Model: new () => U, count: number, customChanges?: KVMap<string, any>): QueryResult<U> {
        let l = new QueryResult<U>();
        for (let idx = 0; idx < count; idx++)
            l.add(AbstractModel.dummy(Model, customChanges));
        return l;
    }

    /**
     * @override
     * @inheritdoc
     */
    equals(model: any): boolean {
        if (!(model instanceof AbstractModel))
            return false;
        return (this.id === model.id) && (JsTypes.belongToTheSameClass(this, model));
    }

    /**
     * Validate all properties.
     * @returns {bolean} True if valid, else false.
     */
    valid(): boolean {
        let valid = true;
        this._properties.foreach((propertyName, property) => {
            if (!property.valid(this[propertyName]))
                valid = false;
        });
        return valid;
    }

    /**
     * @todo Remove this? Moved to WixDatabase?
     * Return an object holding all properties defined for this model.
     * @returns {object} The object holding the properties defined for this model.
     */
    strip(): object {
        return AbstractModel.strip(this);
    }

    /**
     * @todo Remove this? Moved to WixDatabase?
     * Return an object holding all properties defined for the given model.
     * @param {AbstractModel<any>} model The model to be translated.
     * @returns {object} The object holding the properties defined for the given model.
     */
    static strip<U extends AbstractModel<U>>(model: AbstractModel<U>): object {
        let item = {};
        model.properties.foreach((propertyName) => {
            item[propertyName] = model[propertyName];
        });
        return item;
    }

    /**
     * Fill this model with the data from the given item.
     * @param {object} item The item containing the data.
     * @returns {ThisParameterType} This.
     */
    fill(item: object): this {
        if (item)
            for (let [key, value] of Object.entries(item))
                if (this.properties.hasKey(key))
                    this[key] = value;
        return this;
    }

    /**
     * Check if has a relative.
     * @param {new()=>U, extends AbstactModel<U>} Relative The class obejct/constructor of the relative.
     * @returns {boolean} True if has relative, else false. 
     */
    public hasRelative<U extends AbstractModel<U>>(Relative: new () => U): boolean {
        if (this.relations.has(Relative))
            return true;

        return false;
    }

    /**
     * Get a relative.
     * @param {new()=>U, extends AbstactModel<U>} Relative The class obejct/constructor of the relative.
     * @returns {AbstractModel<any>} The relative. 
     */
    public relative<U extends AbstractModel<U>>(Relative: new () => U): U {
        let relation = this.relations.get(Relative);

        if (!relation)
            throw new NullPointerException(PATH, "relative", "A relation to the given relative " + Relative + " does not exist");

        let relative = new Relative();
        relative.parent = this;
        return relative;
    }

    /**
     * Add a relation of 0..1 to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 0..1 to 1 - this has one Model.
     */
    zeroOrOneToOne<U extends AbstractModel<U>>(Model: { new(): U }): void {
        // This logic inverse.

        this.relations.add(Model, new OneToZeroOrOne(Model, this.Constructor));
        this.properties.string(AbstractModel.asFk(Model));
    }

    /**
     * Add a relation of 1 to 0..1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to 0..1 - this has one optional Model.
     */
    oneToZeroOrOne<U extends AbstractModel<U>>(Model: { new(): U }): void {
        // This logic inverse.

        this.relations.add(Model, new ZeroOrOneToOne(Model, this.Constructor));
    }

    /**
     * Add a relation of 1 to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as 1 to n - this has many Models.
     */
    oneToMany<U extends AbstractModel<U>>(Model: { new(): U }): void {
        // This logic, inverse.

        this.relations.add(Model, new ManyToOne(Model, this.Constructor));
    }

    /**
     * Add a relation of n to 1 relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to 1 - this belongs to one Model.
     */
    manyToOne<U extends AbstractModel<U>>(Model: { new(): U }): void {
        // This logic, inverse.
        this.relations.add(Model, new OneToMany(Model, this.Constructor));
        this.properties.string(AbstractModel.asFk(Model));
    }

    /**
     * @todo
     * Add a relation of n to n relationship.
     * @param  {{new(): U}} Model The Model (class) this is associated to as n to n - this belongs to many Models.
     */
    manyToMany<U extends AbstractModel<U>>(Model: { new(): U }): void {
        let thisTableName = this.tableName;
        let thisAsFk = this.asFk();

        let roleModelClass = class RoleModel extends AbstractModel<RoleModel>{

            protected Constructor: new () => RoleModel;

            init(): void {
                this.Constructor = RoleModel;
            }

            addProperties(): void {
                this.properties.
                    string(AbstractModel.asFk(Model)).
                    string(thisAsFk);
            }

            addRelations(): void {

            }

            /**
             * @override
             */
            get tableName() {
                return AbstractModel.roleTableNameOf(thisTableName, AbstractModel.tableName(Model));
            }
        }

        this.relations.add(Model, new ManyToMany(Model, this.Constructor, roleModelClass));
    }

    /**
     * Check if the parent of this is the root.
     * @returns {boolean} True if the parent is the root, else false.
     */
    private myParentIsTheRoot(): boolean {
        if (this.parent)
            if (!this.parent.parent)
                return true;
        return false;
    }

    /**
     * Assign the given model (this by default) to the given relative if linked.
     * @param {U extends AbstractModel<U>, AnyNumber<U>} relatives The relatives the given model will be assigned to.
     * @returns {this} This.
     */
    assign<U extends AbstractModel<U>>(relatives: AnyNumber<U>): this {
        AbstractModel.assign(<T><unknown>this, relatives);
        return this;
    }

    /**
     * Assign the given models to the given relatives if linked.
     * @param {P extends AbstractModel<P>, AnyNumber<P>} models The models to be assigned.
     * @param {U extends AbstractModel<U>, AnyNumber<U>} relatives The relatives the given model will be assigned to. 
     */
    static assign<P extends AbstractModel<P>, U extends AbstractModel<U>>(models: AnyNumber<P>, relatives: AnyNumber<U>): void {
        let modelsList = new List<P>(models);
        let relativesList = new List<U>(relatives);
        if (modelsList.isEmpty() || relativesList.isEmpty())
            return;

        modelsList.first().relations.get(relativesList.first().Constructor).assign(models, relatives);
    }

    /**
     * Link the given model (this by default) to the given relative.
     * @param {U extends AbstractModel<U>, AnyNumber<U>} relatives The relatives the given model will be linked to.
     * @returns {this} This.
     */
    link<U extends AbstractModel<U>>(relatives: AnyNumber<U>): this {
        AbstractModel.link(<T><unknown>this, relatives);
        return this;
    }

    /**
     * Link the given models to the given relatives.
     * @param {T extends AbstractModel<T>, AnyNumber<T>} models The models to be linked.
     * @param {U extends AbstractModel<U>, AnyNumber<U>} relatives The relatives the given model will be linked to. 
     */
    static link<P extends AbstractModel<P>, U extends AbstractModel<U>>(models: AnyNumber<P>, relatives: AnyNumber<U>): void {
        let modelsList = new List<P>(models);
        let relativesList = new List<U>(relatives);
        if (modelsList.isEmpty() || relativesList.isEmpty())
            return;
        modelsList.first().relations.get(relativesList.first().Constructor).link(models, relatives);
    }

    /**
     * Load Models.
     * @param {<U extends AbstractModel<U>>, AnyNumber<new() => U>} Models The Models (classes) to be loaded. 
     * @returns {Promise<this|QueryResult<AbstractModel>>} This if multiple models were passed or 
     * the loaded objects if only one model was passed (allowing to chain operations).
     */
    async load(models: AnyNumber<new () => AbstractModel<any>>): Promise<this | QueryResult<AbstractModel<any>>> {
        let modelsList = new List<new () => AbstractModel<any>>(models);

        let ret: this | QueryResult<AbstractModel<any>> = this;
        await modelsList.foreachAsync(async (Model) => {
            let relation = this.relations.get(Model).inverse();
            ret = await relation.relationalFind(<T><unknown>this);
            ret.assign(this);
        });

        return ret;
    }

    /**
     * Loads many models that are stored as property and can be accessed indirectly model by model creating a chain.
     * @param {AnyNumber<new()=>AbstractModel<any>>} models The models to be loaded in the order of the chain.
     * @returns {this} This.
     */
    async loadChain(Models: AnyNumber<new () => AbstractModel<any>>): Promise<this> {
        let modelsList = new List<new () => AbstractModel<any>>(Models);

        let res: QueryResult<AbstractModel<any>> | this = this;
        await modelsList.foreachAsync(async (Model, idx) => {
            res = await res.load(Model);
        });
        return this;
    }

    /**
     * Check if an entity of this model with the given id exists.
     * @param {string} id The id of the entity.
     * @returns {boolean} True if exists, else false.
     */
    async exists(id: string): Promise<boolean> {
        return AbstractModel.exists(id, this.Constructor);
    }

    /**
     * Check if an entity of the given model with the given id exists.
     * @param {string} id The id of the entity.
     * @param {new()=>U} Model The Model of the entity.
     * @returns {boolean} True if exists, else false.
     */
    static async exists<U extends AbstractModel<U>>(id: string, Model: new () => U): Promise<boolean> {
        if (await WixDatabase.has(id, Model))
            return true;

        return false;
    }

    /**
     * Get this item with the data in database.
     * @return {Promise<T>} The item.
     */
    async synchronize(): Promise<this> {
        let item = await AbstractModel.get(this.id, this.Constructor);
        return this.fill(item);
    }

    /**
     * Get an item of the given model by the given id.
     * @param {string} pk The primary key of the item to be retrieved.  
     * @param {new()=>U} model The model of the item to be retrieved.
     * @returns {Promise<U>} The retrueved model.
     */
    static async get<U extends AbstractModel<U>>(id: string, model: new () => U): Promise<U> {
        return await WixDatabase.get(id, model);
    }

    /**
     * Find all entities returned by a QueryElement (the current QueryElement (chain) by default).
     * If called over a relative, return only those entities that are related to the query result returned by the chained query.
     * @returns {Promise<QueryResult<T>>} The result of the executed query. 
     */
    async find(): Promise<QueryResult<T>> {
        let thisQueryResult: QueryResult<T>;
        // Called over previous.
        if (this.parent) {
            let previousQueryResult: QueryResult<AbstractModel<any>>;
            let propertyTarget: AbstractModel<any> | QueryResult<AbstractModel<any>>;
            let propertyName: string;
            let relationToParent: Relation<AbstractModel<any>, T>;

            // If it's a first generation find, find only items that belong to the parent
            if (this.myParentIsTheRoot()) {
                previousQueryResult = new QueryResult<AbstractModel<any>>(this.parent);
                propertyTarget = this.parent;
            }
            else {
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
            if (((relationToParent instanceof ManyToOne) || (relationToParent instanceof OneToZeroOrOne) || (relationToParent instanceof ZeroOrOneToOne))) {
                propertyTarget[propertyName] = thisQueryResult.first();
                this.lastQueryResult = thisQueryResult.first();
            }
            else {
                propertyTarget[propertyName] = thisQueryResult;
                this.lastQueryResult = thisQueryResult;
            }
        }
        else {
            thisQueryResult = await AbstractModel.find(this.Constructor);
        }

        return thisQueryResult;
    }

    /**
     * Find all entities returned by the given QueryElement.
     * @param {model: new()=>U} model The QueryElement to be resolved.
     * @returns {Promise<QueryResult<<U extends AbstractModel<U>>>>} The result of the executed querry. 
     */
    static async find<U extends AbstractModel<U>>(Model: new () => U): Promise<QueryResult<U>> {
        return await WixDatabase.query(Model).execute();
    }

    /**
     * Create this model (save it in the database).
     */
    async create(): Promise<void> {
        return await AbstractModel.create(<T><unknown>this);
    }

    /**
     * Create models.
     * @param {U|List<U>} models The models to be created.
     */
    static async create<U extends AbstractModel<U>>(models: U | List<U>): Promise<void> {
        let modelsList = new List<U>(models);

        if (modelsList.isEmpty())
            return;

        modelsList.foreach((model) => {
            if (!model.id)
                model.id = UUID();
        });

        modelsList.foreach((model) => {
            if (!model.valid())
                throw new CreateError(PATH, "AbstractModel.create()", model);
        });

        await WixDatabase.create(models);
    }

    /**
     * Save this model (save it in the database).
     */
    async save(): Promise<void> {
        return await AbstractModel.save(<T><unknown>this);
    }

    /**
     * Save models.
     * @param {U|List<U>} models The models to be saved.
     */
    static async save<U extends AbstractModel<U>>(models: U | List<U>): Promise<void> {
        let modelsList = new List<U>(models);

        if (modelsList.isEmpty())
            return;

        modelsList.foreach((model) => {
            if (!model.valid())
                throw new CreateError(PATH, "AbstractModel.save()", model);
        });

        await WixDatabase.save(models);
    }

    /**
     * Update this model (update it in the database).
     */
    async update(models?: AbstractModel<any> | List<AbstractModel<any>>): Promise<void> {
        return await AbstractModel.update(<T><unknown>this);
    }

    /**
     * Update models.
     * @param {U | List<U>} models The models to be updated.
     */
    static async update<U extends AbstractModel<U>>(models: U | List<U>): Promise<void> {
        let modelsList = new List<U>(models);

        if (modelsList.isEmpty())
            return;

        modelsList.foreach((model) => {
            if (!model.valid())
                throw new CreateError(PATH, "AbstractModel.update()", model);
        });

        await WixDatabase.update(models);
    }

    /**
     * Destroy this model (destroy it in the database).
     * If called over relations, destroy the models returned by the query.
     * @param {boolean} [doNotCascade=false] Will not destroy relatives that belong to this model if true.
     */
    async destroy(doNotCascade: boolean = false): Promise<void> {
        let toDestroy: List<AbstractModel<any>> = new List<AbstractModel<any>>(this);
        // Called over previous.
        if (this.parent) {
            toDestroy = await this.find();
        }

        return await AbstractModel.destroy(toDestroy, doNotCascade);
    }

    /**
     * Destroy models.
     * @param {U | List<U>} models The models to be destroyed.
     * @param {boolean} [doNotCascade=false] Will not destroy relatives that belong to this model if true.
     */
    static async destroy<U extends AbstractModel<U>>(models: U | List<U>, doNotCascade: boolean = false): Promise<void> {
        let modelsList = new List<U>(models);

        if (modelsList.isEmpty())
            return;

        modelsList.foreach((model) => {
            if (!model.valid())
                throw new CreateError(PATH, "AbstractModel.destroy()", model);
        });

        if (!doNotCascade)
            await modelsList.first().relations.values().foreachAsync(async (relation) => {
                await relation.inverse().relationalDestroy(modelsList);
            });

        await WixDatabase.remove(modelsList);
    }

    /**
     * Get the primary key column name of this model.
     * @returns {string} The primary key column name.
     */
    public asPk(): string {
        return "id";
    }

    /**
     * Get the foreign key column name of this model.
     * @returns {string} The foreign key column name.
     */
    public asFk(): string {
        return this.tableName.charAt(0).toLowerCase() + this.tableName.slice(1) + "Id";
    }

    /**
     * Get the foreign key column name of the given model.
     * @param {U extends AbstractModel<U>} Model The model the foreign key column name will be returned of.
     * @returns {string} The foreign key column name. 
     */
    static asFk<U extends AbstractModel<U>>(Model: new () => U): string {
        return (new Model()).asFk();
    }

    /**
     * Get the default name of this Model as a single property.
     * @returns {string} The name of this Model as a single property.
     */
    public asSinglePropertyName(): string {
        return this.tableName.charAt(0).toLowerCase() + this.tableName.slice(1);
    }

    public getRelation<U extends AbstractModel<U>>(relative: new () => U): Relation<any, T> {
        return this.relations.get(relative);
    }

    static asSinglePropertyName<U extends AbstractModel<U>>(Model: new () => U): string {
        return (new Model()).asSinglePropertyName();
    }

    /**
     * Get the default name of this Model as a multiple property.
     * @returns {string} The name of this Model as a multiple property.
     */
    public asMultiplePropertyName(): string {
        return this.asSinglePropertyName() + "s";
    }

    static asMultiplePropertyName<U extends AbstractModel<U>>(Model: new () => U): string {
        return (new Model()).asMultiplePropertyName();
    }

    /**
     * Get the name of the role table of two models named by the given names.
     * @param {string} modelName1 The name of the first model.
     * @param {string} modelName2 The name of the second model.
     * @returns {string} The name of the role table of two models named by the given names.
     */
    static roleTableNameOf(modelName1: string, modelName2: string): string {
        let ending = (modelName1.toLowerCase() < modelName2.toLowerCase()) ? modelName1 + modelName2 : modelName2 + modelName1;
        return "Role" + ending;
    }

    static tableName<U extends AbstractModel<U>>(Model: new () => U): string {
        return (new Model()).tableName;
    }

    static modelName<U extends AbstractModel<U>>(Model: new () => U): string {
        return (new Model()).modelName;
    }

    /**
     * Get the table name of this model. Resolves into the name of the model/class by default.
     * @returns {string} The name of the table of this model.
     */
    get tableName(): string {
        return this.Constructor.name;
    }

    /**
     * Get the name of this model. Resolves into the name of the model/class by default.
     * @returns {string} The name of the table of this model.
     */
    get modelName(): string {
        return this.Constructor.name;
    }

    /**
     * Get the primary key of this model.
     * @returns {string} The primary key of this model.
     */
    get id(): string {
        return this._id;
    }

    get properties(): Properties {
        return this._properties;
    }

    /**
     * Set the primary key of this model.
     * @param {string} id The new primary key.
     */
    set id(id: string) {
        this._id = id;
    }

    /**
     * Set properties.
     */
    set properties(properties: Properties) {
        if (!this._properties)
            this._properties = new Properties();
        properties.foreach((propertyName, property) => { this._properties.add(propertyName, property); });
    }

    /**
     * Set the last query result.
     * @param {QueryResult<T>} lastQueryResult The last query result.
     */
    private set lastQueryResult(lastQueryResult: QueryResult<T> | AbstractModel<T>) {
        this._lastQueryResult = lastQueryResult;
    }

    /**
     * Get the last query result.
     * @returns {QueryResult<T>} The last query result.
     */
    private get lastQueryResult(): QueryResult<T> | AbstractModel<T> {
        return this._lastQueryResult;
    }

    /**
     * Set parent.
     * @param {AbstractModel<any>} parent The parent.
     */
    private set parent(parent: AbstractModel<any>) {
        this._parent = parent;
    }

    /**
     * Get parent.
     * @returns {AbstractModel<any>} The parent.
     */
    private get parent(): AbstractModel<any> {
        return this._parent;
    }

    /**
     * Get the root element.
     * @returns {AbstractModel<any>} The root element or this, if this is the root element.
     */
    private get root(): AbstractModel<any> {
        let next: AbstractModel<any> = this;
        while (next.parent)
            next = next.parent;
        return next;
    }

    /**
     * Set all relations of this model.
     * @param {KVMap<new()=>AbstractModel<any>, Relation<new()=>AbstractModel<any>, new()=>T>>} relations The relations.
     */
    private set relations(relations: KVMap<new () => AbstractModel<any>, Relation<AbstractModel<any>, T>>) {
        this._relations = relations;
    }

    /**
     * Get all relations of this model.
     * @returns {KVMap<AbstractModel<any>, Relation<AbstractModel<any>, T>>} The relations.
     */
    private get relations(): KVMap<new () => AbstractModel<any>, Relation<AbstractModel<any>, T>> {
        return this._relations;
    }

    get Model(): new () => T {
        return this.Constructor;
    }
}



export class Properties extends KVMap<string, Property>
{
    constructor() {
        super();
    }

    string(name: string, ...attributes: Array<string>): this {
        let property = new StringProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }

    number(name: string, ...attributes: Array<string>): this {
        let property = new NumberProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }
}


export abstract class Property {
    protected validAttributes: Set<string>;
    protected _attributes: Set<string>;

    constructor() {
        this.validAttributes = new Set<string>([
            "nullable"
        ]);

        this.attributes = new Set<string>();
    }

    valid(toCheck: any): boolean {
        if (JsTypes.isUnspecified(toCheck))
            if (!this.attributes.has("nullable"))
                return false;
        return true;
    }

    abstract dummy(): any

    set attributes(attributes: Set<string>) {
        this._attributes = new Set<string>();

        attributes.foreach((attribute) => {
            if (this.validAttributes.has(attribute))
                this._attributes.add(attribute);
            else
                throw new InvalidOperationError(PATH, "Property.set attributes()", "The attribute " + attribute + " doesn't exist.");
        });
    }

    get attributes(): Set<string> {
        return this._attributes;
    }
}

export class StringProperty extends Property {
    constructor(attributes: Set<string>) {
        super();

        this.validAttributes.add(
            "emtiable"
        );

        this.attributes = attributes;
    }

    valid(toCheck: any): boolean {
        if (!super.valid(toCheck))
            return false;

        if (typeof (toCheck) !== "string")
            return false;

        if (JsTypes.isEmpty(toCheck) && this.attributes.hasNot("emptiable"))
            return false;

        return true;
    }

    dummy(): string {
        return UUID();
    }
}

export class NumberProperty extends Property {
    constructor(attributes: Set<string>) {
        super();
        this.validAttributes.add(
            "negative",
            "positive",
            "notZero"
        );

        this.attributes = attributes;
    }

    valid(toCheck: any): boolean {
        if (!super.valid(toCheck))
            return false;

        if (typeof (toCheck) !== "number")
            return false;

        if (this.attributes.has("negative") && toCheck > 0)
            return false;

        if (this.attributes.has("positive") && toCheck < 0)
            return false;

        if (this.attributes.has("notZero") && toCheck === 0)
            return false;

        return true;
    }

    dummy() {
        let n = Math.random() * 100;

        if (this.attributes.has("negative"))
            n = -n;

        if (this.attributes.has("notZero"))
            if (n === 0)
                n += 1;

        return n;
    }
}

export default AbstractModel;