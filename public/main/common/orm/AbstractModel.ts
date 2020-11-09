const PATH = "public/main/common/orm/AbstractModel.js";

// @ts-ignore
import { v4 as UUID } from 'uuid';
import Set from "../util/collections/set/Set.js";
import KVMap from '../util/collections/map/KVMap';
import List from '../util/collections/list/List';
import JsTypes from '../util/jsTypes/JsTypes';
import InvalidOperationError from '../util/error/InvalidOperationError';
import type { AnyNumber } from "../util/supportive";
import VariableValueError from '../util/error/VariableValueError.js';

/**
 * @todo Add undo operations for save etc. Important in case a save is not possible but uve updated already some references.
 */

/**
 * @class
 * A class representing an abstract model.
 */

abstract class AbstractModel<T extends AbstractModel<T>>
{
    protected abstract Constructor: new () => T;
    protected abstract modelName: string;
    protected _properties: Properties;

    /**
     * Create an Abstract Model.
     */
    constructor (data?: object)
    {
        this.boot(data);
    }

    protected boot(data?: object): void
    {
        this.properties = new Properties();
        this.properties.
            string("id");

        this.addProperties();

        if (data)
            this.fill(data);

        this.init(data);
    }

    abstract init(data?: object): void;

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
     * Get a valid dummy of the given model.
     * @param {U extends AbstractModel<U>} Model The model of which a dummy will be created.
     * @returns {T} A dummy initialized with valid data.
     */
    static dummy<U extends AbstractModel<U>>(Model: new () => U, customChanges?: KVMap<string, any>): U
    {
        let u = new Model();
        const item = {};

        u.properties.foreach((propertyName, property) => { item[propertyName] = property.dummy(); });
        u = u.fill(item);

        if (customChanges)
            customChanges.foreach((propertyname, value) => { u[propertyname] = value; });
        return u;
    }

    /**
     * Get multiple instances of a dummy of this model.
     * @param {U extends AbstractModel<U>} Model The model of which duummies will be created.
     * @param {number} count The amount of dummies to be created.
     * @returns {List<T>} A list containing the given amount of dummies initialized with valid data.
     */
    static dummies<U extends AbstractModel<U>>(Model: new () => U, count: number, customChanges?: KVMap<string, any>): List<U>
    {
        const l = new List<U>();
        for (let idx = 0; idx < count; idx++)
            l.add(AbstractModel.dummy(Model, customChanges));
        return l;
    }

    /**
     * Validate all properties.
     * @returns {bolean} True if valid, else false.
     */
    valid(propertyNamesToCheck?: AnyNumber<string>): boolean
    {
        let valid = true;
        const propertyNamesToCheckList = new List<string>(propertyNamesToCheck);
        const toCheck = (propertyNamesToCheckList.isEmpty()) ? this.properties : this.properties.filter(name => propertyNamesToCheckList.has(name));
        toCheck.foreach((propertyName, property) =>
        {
            if (!property.valid(this[propertyName]))
                valid = false;
        });
        return valid;
    }

    /**
     * Return an object holding the properties given and defined for this model.
     * @param {AnyNumber<string>} propertyNamesToConsider The property names to be considered. If empty, all properties of the given model will be considered.
     * @returns {object} The object holding the properties defined for this model.
     */
    strip(propertyNamesToConsider?: AnyNumber<string>): { [x: string]: any; id?: string; }
    {
        const propertyNamesToConsiderList = new List<string>(propertyNamesToConsider);
        return AbstractModel.strip(this, (propertyNamesToConsiderList.isEmpty()) ? this.properties.keys() : propertyNamesToConsiderList);
    }

    /**
     * Return an object holding only properties of the property names passed to this function.
     * @param {object} object The object containing the properties.
     * @param {AnyNumber<string>} propertyNamesToConsider The property names to be considered.
     * @returns {object} An object holding the given properties.
     */
    static strip(object: object, propertyNamesToConsider: AnyNumber<string>): { [x: string]: any; id?: string; }
    {
        const propertyNamesToConsiderList = new List<string>(propertyNamesToConsider);
        if (propertyNamesToConsiderList.isEmpty())
            throw new VariableValueError(PATH, 'static strip', propertyNamesToConsider, 'Not empty');

        const item: { [x: string]: any; id?: string; } = {};

        propertyNamesToConsiderList.foreach((propertyName) =>
        {
            if (object[propertyName] !== undefined)
                item[propertyName] = object[propertyName];
        });

        return item;
    }

    /**
     * Get a new Model that equals this one considering only the properties with the given property names.
     * @param {AnyNumber<string>} propertyNamesToConsider The property names to be considered.
     * @returns {AbstractModel<T>} The new model. 
     */
    reduce(propertyNamesToConsider: AnyNumber<string>): T
    {
        return AbstractModel.reduce(this as unknown as T, propertyNamesToConsider).first();
    }

    static reduce<U extends AbstractModel<U>>(models: AnyNumber<U>, propertyNamesToConsider: AnyNumber<string>): List<U>
    {
        const propertyNamesToConsiderList = new List<string>(propertyNamesToConsider);
        return new List(models).map((model: U) =>
        {
            const ret = new model.Constructor();
            propertyNamesToConsiderList.foreach(fieldName => ret[fieldName] = model[fieldName]);
            return ret;
        });
    }

    /**
     * Fill this model with the data from the given item.
     * @param {object} item The item containing the data.
     * @returns {ThisParameterType} This.
     */
    fill(item: object): this
    {
        if (item)
            for (const [key, value] of Object.entries(item))
                if (this.properties.hasKey(key))
                    this[key] = value;
        return this;
    }


    static modelName<U extends AbstractModel<U>>(Model: new () => U): string
    {
        return (new Model()).modelName;
    }

    /**
     * Set properties.
     */
    set properties(properties: Properties)
    {
        if (!this._properties)
            this._properties = new Properties();
        properties.foreach((propertyName, property) => { this._properties.add(propertyName, property); });
    }

    get properties(): Properties
    {
        return this._properties;
    }

    get Model(): new () => T
    {
        return this.Constructor;
    }
}



// tslint:disable-next-line: max-classes-per-file
export class Properties extends KVMap<string, Property>
{
    constructor ()
    {
        super();
    }

    string(name: string, ...attributes: string[]): this
    {
        const property = new StringProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }

    number(name: string, ...attributes: string[]): this
    {
        const property = new NumberProperty(new Set(attributes));
        this.add(name, property);
        return this;
    }
}


// tslint:disable-next-line: max-classes-per-file
export abstract class Property
{
    protected validAttributes: Set<string>;
    protected _attributes: Set<string>;

    constructor ()
    {
        this.validAttributes = new Set<string>([
            "nullable"
        ]);

        this.attributes = new Set<string>();
    }

    valid(toCheck: any): boolean
    {
        if (JsTypes.isUnspecified(toCheck))
            if (!this.attributes.has("nullable"))
                return false;
        return true;
    }

    abstract dummy(): any

    set attributes(attributes: Set<string>)
    {
        this._attributes = new Set<string>();

        attributes.foreach((attribute) =>
        {
            if (this.validAttributes.has(attribute))
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

// tslint:disable-next-line: max-classes-per-file
export class StringProperty extends Property
{
    constructor (attributes: Set<string>)
    {
        super();

        this.validAttributes.add(
            "emtiable"
        );

        this.attributes = attributes;
    }

    valid(toCheck: any): boolean
    {
        if (JsTypes.isUnspecified(toCheck))
        {
            if (this.attributes.has('nullable'))
                return true;
            return false;
        }

        if (!super.valid(toCheck))
            return false;

        if (JsTypes.isEmpty(toCheck) && this.attributes.hasNot("emptiable"))
            return false;

        if (typeof (toCheck) !== "string")
            return false;

        return true;
    }

    dummy(): string
    {
        return UUID();
    }
}

// tslint:disable-next-line: max-classes-per-file
export class NumberProperty extends Property
{
    constructor (attributes: Set<string>)
    {
        super();
        this.validAttributes.add(
            "negative",
            "positive",
            "notZero"
        );

        this.attributes = attributes;
    }

    valid(toCheck: any): boolean
    {
        if (!super.valid(toCheck))
            return false;

        if (JsTypes.isUnspecified(toCheck))
        {
            if (this.attributes.has('nullable'))
                return true;
            return false;
        }

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

    dummy()
    {
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