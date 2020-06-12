const PATH = "public/src/main/common/wixData/WixDataRepository.js";

import KVMap from "public/src/main/common/util/map/KVMap.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

import WixData from "public/src/main/common/wixData/WixData.js"

/**
 * @class
 * A class representing an WixDataRepository (collection).
 */
class WixDataRepository
{
	/**
	 * Create a WixDataRepository.
	 * @param {string} collectionName - The name of the collection this repository is pointing to.
	 * @param {KVMap | empty} [mapping] The mapping between the js object and the wix db item (object key -> item key). Empty if identical mapping.
	 * @param {boolean} [authorisation=true] Defines if authorisation should be done.
	 * @param {boolean} [hooks=true] Defines if hooks should be considered.
	 */
	constructor(collectionName, mapping=null, authorisation=true, hooks=true)
	{	
		this._options = {};

		this.collectionName = collectionName;
		this.mapping = mapping;
		this.authorisation = authorisation;
		this.hooks = hooks;
	}

	/**
	 * Transforms an object to a wix db item considering the given mapping.
	 * @param {object} [o] The object to be transformed.
	 * @return {object} The wix db item.
	 */
	toItem(o)
	{
		if(JsTypes.isEmpty(this.mapping))
			return o;

		if(!JsTypes.isObject(o))
			throw new VariableTypeError(PATH, "WixDataRepository.toItem()", o, "object");
		
		let i = {};
		this.mapping.keys().foreach(key => i[this.mapping.get(key)] = o[key]);
		return i;
	}

	/**
	 * Transforms a wix db item to an object considering the given mapping.
	 * @param {object} [i] The item to be transformed.
	 * @return {object} The resulting object.
	 */
	toObject(i)
	{
		if(JsTypes.isEmpty(this.mapping))
			return i;

		if(!JsTypes.isObject(i))
			throw new VariableTypeError(PATH, "WixDataRepository.toObject()", i, "object");

		let o = {};
		this.mapping.keys().foreach(key => o[key] = i[this.mapping.get(key)]);
		return o;
	}

	/**
	 * Retrieves an item with the given id.
	 * @param {string} [itemId] The id of the item to be retrived.
	 * @return {object | null} Object representing the retrieved item or null if there was no item with the given id.
	 */
	async get(itemId)
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.get()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.get()", itemId, "The id of the item, not empty.");

		return WixData.get(this.collectionName, itemId, this._options).then((item) => {return (JsTypes.isEmpty(item))?null:this.toObject(item);});
	}

	/**
	 * Get a query that specifies an item selection.
	 * @param {number} [itemLimit=50] The limit of the number of items to be retrieved.
	 * @return {wix-data.query} The query.
	 */
	query(itemLimit = 50)
	{
		if(!JsTypes.isNumber(itemLimit))
			throw new VariableTypeError(PATH, "WixDataRepository.query()", itemLimit, "number");
		if(itemLimit < 1)
			throw new VariableValueError(PATH, "WixDataRepository.query()", itemLimit, "Limit > 0");

		return WixData.query(this.collectionName, itemLimit, this._options);
	}

	/**
	 * Executes a query.
	 * @param {wix-data.query} [query] The query to be executed.
	 * @return {Array.<?>} The resulting items of the executed query.
	 */
	async find(query)
	{
		if(JsTypes.isEmpty(query))
			throw new VariableTypeError(PATH, "WixDataRepository.find()", query, "A wix-data query.");

		return query.find().then((result) => {
			let ret = [];
			for(let idx in result.items)
				ret.push((JsTypes.isEmpty(result.items[idx]))?null:this.toObject(result.items[idx]));
			return ret;
		});
	} 

	/**
	 * Inserts an item.
	 * @param {object} [object] An object representing the item to be inserted.
	 */
	async insert(object)
	{
		if(JsTypes.isEmpty(object))
			throw new VariableTypeError(PATH, "WixDataRepository.insert()", object, "object");

		await WixData.insert(this.collectionName, this.toItem(object), this._options);
	}

	/**
	 * Saves an item. If the item already exists, it will be overwritten.
	 * @param {object} [object] An object representing the item to be saved.
	 */
	async save(object)
	{
		if(JsTypes.isEmpty(object))
			throw new VariableTypeError(PATH, "WixDataRepository.save()", object, "Object.");

		await WixData.save(this.collectionName, this.toItem(object), this._options);
	}

	/**
	 * Updates an item.
	 * @param {object} [object] An object that describes the item to be updated.
	 */
	async update(object)
	{
		if(JsTypes.isEmpty(object))
			throw new VariableTypeError(PATH, "WixDataRepository.update()", object, "Object.");

		await WixData.update(this.collectionName, this.toItem(object), this._options);
	}

	/**
	 * Removes an item.
	 * @param {string} [itemId] The id of the item to be removed.
	 */
	async remove(itemId)
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.remove()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.remove()", itemId, "The id of the item, not empty.");

		await WixData.remove(this.collectionName, itemId, this._options);
	}

	/**
	 * Set collectionName.
	 * @param {string} [collectionName] The name of the collection.
	 */
	set collectionName(collectionName)
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixDataRepository.set collectionName(...)", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixDataRepository.set collectionName(...)", collectionName, "The name of the collection, not empty.");

		this._collectionName = collectionName;
	}

	/**
	 * Set mapping.
	 * @param {KVMap} [mapping] The mapping between an js object and an wix db item.
	 */
	set mapping(mapping)
	{
		if(!JsTypes.isEmpty(mapping))
			if(!(mapping instanceof KVMap))
				throw new VariableTypeError(PATH, "WixDataRepository.set mapping(...)", mapping, "KVMap or empty");

		this._mapping = mapping;
	}

	set authorisation(authorisation)
	{
		if(!JsTypes.isBoolean(authorisation))
			throw new VariableTypeError(PATH, "WixDataRepository.set authorisation(...)", authorisation, "boolean");
		
		this._options["suppressAuth"] = !authorisation;
		this._authorisation = authorisation;
	}

	set hooks(hooks)
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
	get collectionName()
	{	
		return this._collectionName;
	}

	/**
	 * Get mapping.
	 * @return {KVMap} The mapping between an js object and an wix db item.
	 */
	get mapping()
	{
		return this._mapping;
	}

	/**
	 * Get authorisation property.
	 * @return {boolean} The authorisation property.
	 */
	get authorisation()
	{	
		return this._collectionName;
	}

	/**
	 * Get hooks.
	 * @return {boolean} The hooks property.
	 */
	get hooks()
	{
		return this._hooks;
	}
}

export default WixDataRepository