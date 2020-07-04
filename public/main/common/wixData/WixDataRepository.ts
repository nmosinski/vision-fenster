const PATH = "public/main/common/wixData/WixDataRepository.js";

import KVMap from "../util/collections/map/KVMap.js"
import List from "../util/collections/list/List.js"

import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"
import ItemNotFoundError from "public/main/common/wixData/ItemNotFoundError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

import WixData from "public/main/common/wixData/WixData.js"

/**
 * @class
 * A class representing an WixDataRepository (collection).
 */
class WixDataRepository
{
	private _options: object;
	private _collectionName: string;
	private _mapping: KVMap<string,string>;
	private _authorisation: boolean;
	private _hooks: boolean;
	/**
	 * Create a WixDataRepository.
	 * @param {string} collectionName - The name of the collection this repository is pointing to.
	 * @param {KVMap<string,string>} [mapping=null] The mapping between the js object and the wix db item (object key -> item key). Empty if identical mapping.
	 * @param {boolean} [authorisation=true] Defines if authorisation should be done.
	 * @param {boolean} [hooks=true] Defines if hooks should be considered.
	 */
	constructor(collectionName: string, mapping: KVMap<string,string>=null, authorisation: boolean=true, hooks: boolean=true)
	{	
		this._options = {};

		this.collectionName = collectionName;
		this.mapping = mapping;
		this.authorisation = authorisation;
		this.hooks = hooks;
	}

	/**
	 * Transform an object to a wix db item considering the given mapping.
	 * @param {any} o The object to be transformed.
	 * @return {object} The wix db item.
	 */
	_toItem(o: any): object
	{
		if(JsTypes.isUnspecified(this._mapping) || JsTypes.isUnspecified(o))
			return o;

		let i = {};
		this._mapping.keys().foreach(key => i[this._mapping.get(key)] = o[key]);
		return i;
	}

	/**
	 * Transform a wix db item to an object considering the given mapping.
	 * @param {object} i The item to be transformed.
	 * @return {object} The resulting object.
	 */
	_toObject(i: object): object
	{
		if(JsTypes.isUnspecified(this._mapping) || JsTypes.isUnspecified(i))
			return i;

		let o = {};
		this._mapping.keys().foreach((key: string) => {o[key] = i[this._mapping.get(key)];});
		return o;
	}

	/**
	 * Retrieve an item with the given id.
	 * @param {string} itemId The id of the item to be retrived.
	 * @return {Promise<object | null>} Object representing the retrieved item or null if there was no item with the given id.
	 */
	async get(itemId: string): Promise<object | null>
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.get()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.get()", itemId, "The id of the item, not empty.");

		let item = await WixData.get(this.collectionName, itemId, this._options);
		
		if(JsTypes.isUnspecified(item))
			throw new ItemNotFoundError(PATH, "WixDataRepository.get()", itemId);

		return this._toObject(item);
	}

	/**
	 * Get a query that specifies an item selection.
	 * @param {number} [itemLimit=50] The limit of the number of items to be retrieved.
	 * @return {any} The query.
	 */
	query(itemLimit: number = 50): any
	{
		if(!JsTypes.isNumber(itemLimit))
			throw new VariableTypeError(PATH, "WixDataRepository.query()", itemLimit, "number");
		if(itemLimit < 1)
			throw new VariableValueError(PATH, "WixDataRepository.query()", itemLimit, "Limit > 0");

		return WixData.query(this.collectionName, itemLimit, this._options);
	}

	/**
	 * Execute a query.
	 * @param {any} query The query to be executed.
	 * @return {Promise<Array<object>>} The resulting items of the executed query.
	 */
	async find(query: any): Promise<Array<any>>
	{
		if(JsTypes.isUnspecified(query))
			throw new VariableTypeError(PATH, "WixDataRepository.find()", query, "A wix-data query.");

		return query.find().then((result) => {
			let ret = [];
			for(let idx in result.items)
				ret.push(this._toObject(result.items[idx]));
			return ret;
		});
	} 

	/**
	 * Insert an item.
	 * @param {any} object An object representing the item to be inserted.
	 */
	async insert(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.insert()", object, "object");

		await WixData.insert(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Insert many items. If an item already exists, it will be overwritten.
	 * @param {List<any>} objects A List of objects representing the items to be saved.
	 */
	async insertMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.insertMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( object => {items.push(this._toItem(object));});

		await WixData.bulkInsert(this.collectionName, items, this._options);
	}

	/**
	 * Save an item. If the item already exists, it will be overwritten.
	 * @param {any} object An object representing the item to be saved.
	 */
	async save(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.save()", object, "Object.");
		
		await WixData.save(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Save many items. If an item already exists, it will be overwritten.
	 * @param {List<any>} objects A List of objects representing the items to be saved.
	 */
	async saveMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.saveMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( object => {items.push(this._toItem(object));});

		await WixData.bulkSave(this.collectionName, items, this._options);
	}

	/**
	 * Update an item.
	 * @param {any} object An object that describes the item to be updated.
	 */
	async update(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.update()", object, "any.");

		await WixData.update(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Update many items.
	 * @param {List<any>} objects A List of objects representing the items to be updated.
	 */
	async updateMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.updateMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( (object:any) => {items.push(this._toItem(object));});

		await WixData.bulkUpdate(this.collectionName, items, this._options);
	}

	/**
	 * Remove an item.
	 * @param {string} itemId The id of the item to be removed.
	 */
	async remove(itemId: string): Promise<void>
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.remove()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.remove()", itemId, "The id of the item, not empty.");

		await WixData.remove(this.collectionName, itemId, this._options);
	}

	/**
	 * Remove many items.
	 * @param {List<string>} itemIds A List of objects representing the items to be removed.
	 */
	async removeMany(itemIds: List<string>): Promise<void>
	{
		if(!(itemIds instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.removeMany()", itemIds, "List<string>.");

		await WixData.bulkRemove(this.collectionName, itemIds.toArray(), this._options);
	}

	/**
	 * Set collectionName.
	 * @param {string} collectionName The name of the collection.
	 */
	set collectionName(collectionName: string)
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixDataRepository.set collectionName(...)", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixDataRepository.set collectionName(...)", collectionName, "The name of the collection, not empty.");

		this._collectionName = collectionName;
	}

	/**
	 * Set mapping.
	 * @param {KVMap<string,string>} mapping The mapping between an js object and an wix db item.
	 */
	set mapping(mapping: KVMap<string,string>)
	{
		if(!JsTypes.isUnspecified(mapping))
		{
			if(!(mapping instanceof KVMap))
				throw new VariableTypeError(PATH, "WixDataRepository.set mapping(...)", mapping, "KVMap<string,string>");
			else
				this._mapping = mapping;
		}
		else
			this._mapping = mapping;
	}

	/**
	 * Set authorisation option.
	 * @param {boolean} authorisation The authorisation option.
	 */
	set authorisation(authorisation: boolean)
	{
		if(!JsTypes.isBoolean(authorisation))
			throw new VariableTypeError(PATH, "WixDataRepository.set authorisation(...)", authorisation, "boolean");
		
		this._options["suppressAuth"] = !authorisation;
		this._authorisation = authorisation;
	}

	/**
	 * Set hooks option.
	 * @param {boolean} hooks The hooks option.
	 */
	set hooks(hooks: boolean)
	{
		if(!JsTypes.isBoolean(hooks))
			throw new VariableTypeError(PATH, "WixDataRepository.set hooks(...)", hooks, "hooks");
		
		this._options["suppressHooks"] = !hooks;
		this._hooks = hooks;
	}

	/**
	 * Get collectionName.
	 * @return {string} The name of the collection.
	 */
	get collectionName(): string
	{	
		return this._collectionName;
	}

	/**
	 * Get authorisation property.
	 * @return {boolean} The authorisation property.
	 */
	get authorisation(): boolean
	{	
		return this._authorisation;
	}

	/**
	 * Get hooks.
	 * @return {boolean} The hooks property.
	 */
	get hooks(): boolean
	{
		return this._hooks;
	}
}

export default WixDataRepository;