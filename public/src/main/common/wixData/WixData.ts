const PATH = "public/src/main/common/wixData/WixData.js";

import ForeignError from "public/src/main/common/util/error/ForeignError.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

import wixData from "wix-data"

/**
 * @class
 * A wrapper class for Wix.wix-data.
 */
class WixData
{
	/**
	 * Wix.wix-data.get - wrapper.
	 * Retrieve an item with the given id from the given collection.
	 * @param {string} collectionName The name of the collection the item will be retrieved from.
	 * @param {string} itemId The id of the item to be retrived.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 * @return {Promise<object>} The requested item.
	 */
	static async get(collectionName: string, itemId: string, options: object = null): Promise<Object>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.get()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.get()", collectionName, "The name of the collection, not empty.");
		
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixData.get()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixData.get()", itemId, "The id of the item, not empty.");

		return wixData.get(collectionName, itemId, options).then((item) => {return item;}).catch(err => {throw new ForeignError(PATH, "WixData.get(...)", err)});
	}

	/**
	 * Wix.wix-data.query - wrapper.
	 * Get a query that specifies an item selection from a collection.
	 * @param {string} collectionName The name of the collection the item will be retrieved from.
	 * @param {number} [itemLimit=50] The limit of the number of items to be retrieved.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 * @return {any} The query.
	 */
	static query(collectionName: string, itemLimit: number = 50, options: object = null): any
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.query()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.query()", collectionName, "The name of the collection, not empty.");
		
		if(!JsTypes.isNumber(itemLimit))
			throw new VariableTypeError(PATH, "WixData.query()", itemLimit, "number");
		if(itemLimit < 1)
			throw new VariableValueError(PATH, "WixData.query()", itemLimit, "Limit > 0");

		return wixData.query(collectionName, itemLimit, options);
	}

	/**
	 * Wix.wix-data.find - wrapper.
	 * Execute a query.
	 * @param {any} query The query to be executed.
	 * @return {Promise<object>} An object representing the results of the executed query.
	 */
	static async find(query: any): Promise<Object>
	{
		if(JsTypes.isUnspecified(query))
			throw new VariableTypeError(PATH, "WixData.find()", query, "A wix-data query.");

		return query.find().then((result) => {return result;}).catch(err=>{throw new ForeignError(PATH, "WixData.get(...)", err)});
	}

	/**
	 * Wix.wix-data.insert - wrapper.
	 * Insert an item into the given collection.
	 * @param {string} collectionName The name of the collection the item will be inserted in.
	 * @param {any} item An object representing the item to be inserted.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async insert(collectionName: string, item: any, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.insert()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.insert()", collectionName, "The name of the collection, not empty.");

		if(JsTypes.isUnspecified(item))
			throw new VariableTypeError(PATH, "WixData.insert()", item, "Object.");

		try
		{
			await wixData.insert(collectionName, item, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.insert(...)", err);
		}
	}

	/**
	 * Wix.wix-data.bulkInsert - wrapper.
	 * Insert multiple items in the given collection. If the item already exists in the given collection, it will be overwritten.
	 * @param {string} collectionName The name of the collection the item will be saved in.
	 * @param {Array<any>} items An array holding all objects representing the items to be saved.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async bulkInsert(collectionName: string, items: Array<any>, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.bulkInsert()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.bulkInsert()", collectionName, "An array with the names of the collections, not empty.");

		if(!JsTypes.isArray(items))
			throw new VariableTypeError(PATH, "WixData.bulkInsert()", items, "array<string>");
		if(JsTypes.isEmpty(items))
			throw new VariableValueError(PATH, "WixData.bulkInsert()", items, "An array with the items, not empty.");
	

		try
		{
			await wixData.bulkInsert(collectionName, items, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.bulkInsert(...)", err);
		}
	}

	/**
	 * Wix.wix-data.save - wrapper.
	 * Save an item in the given collection. If the item already exists in the given collection, it will be overwritten.
	 * @param {string} collectionName The name of the collection the item will be saved in.
	 * @param {any} item An object representing the item to be saved.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async save(collectionName: string, item: any, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.save()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.save()", collectionName, "The name of the collection, not empty.");

		if(JsTypes.isUnspecified(item))
			throw new VariableTypeError(PATH, "WixData.save()", item, "Object.");

		try
		{
			await wixData.save(collectionName, item, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.save(...)", err);
		}
	}

	/**
	 * Wix.wix-data.bulkSave - wrapper.
	 * Save multiple items in the given collection. If the item already exists in the given collection, it will be overwritten.
	 * @param {string} collectionName The name of the collection the item will be saved in.
	 * @param {Array<any>} items An array containing the objects representing the items to be saved.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async bulkSave(collectionName: string, items: Array<any>, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.bulkSave()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.bulkSave()", collectionName, "An array with the names of the collections, not empty.");

		if(!JsTypes.isArray(items))
			throw new VariableTypeError(PATH, "WixData.bulkSave()", items, "array<string>");
		if(JsTypes.isEmpty(items))
			throw new VariableValueError(PATH, "WixData.bulkSave()", items, "An array with the items, not empty.");
	

		try
		{
			await wixData.bulkSave(collectionName, items, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.bulkSave(...)", err);
		}
	}

	/**
	 * Wix.wix-data.update - wrapper.
	 * Update an item in the given collection.
	 * @param {string} collectionName The name of the collection the item will be updated in.
	 * @param {object} item An object that describes the item to be updated.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async update(collectionName: string, item: object, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.update()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.update()", collectionName, "The name of the collection, not empty.");

		if(JsTypes.isUnspecified(item))
			throw new VariableTypeError(PATH, "WixData.update()", item, "Object.");

		try
		{
			await wixData.update(collectionName, item, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.update(...)", err);
		}
	}

	/**
	 * Wix.wix-data.bulkUpdate - wrapper.
	 * Update multiple items in the given collection. If the item already exists in the given collection, it will be overwritten.
	 * @param {string} collectionName The name of the collection the item will be updated in.
	 * @param {Array<any>} items An object representing the item to be updated.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async bulkUpdate(collectionName: string, items: Array<any>, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.bulkUpdate()", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.bulkUpdate()", collectionName, "An array with the names of the collections, not empty.");

		if(!JsTypes.isArray(items))
			throw new VariableTypeError(PATH, "WixData.bulkUpdate()", items, "array<string>");
		if(JsTypes.isEmpty(items))
			throw new VariableValueError(PATH, "WixData.bulkUpdate()", items, "An array with the items, not empty.");
	

		try
		{
			await wixData.bulkUpdate(collectionName, items, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.bulkUpdate(...)", err);
		}
	}

	/**
	 * Wix.wix-data.remove - wrapper.
	 * Remove an item from the given collection.
	 * @param {string} collectionName The name of the collection the item will be removed from.
	 * @param {string} itemId The id of the item to be removed.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async remove(collectionName: string, itemId: string, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.remove(...)", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.remove(...)", collectionName, "The name of the collection, not empty.");
		
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixData.remove()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixData.remove()", itemId, "The id of the item, not empty.");
		
		try
		{
			await wixData.remove(collectionName, itemId, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.remove(...)", err);
		}
	}

	/**
	 * Wix.wix-data.bulkRemove - wrapper.
	 * Remove an item from the given collection.
	 * @param {string} collectionName The name of the collection the item will be removed from.
	 * @param {Array<string>} itemIds The an array of ids of the items to be removed.
	 * @param {object} [options=null] The options for this operation like in wix documentation explained.
	 */
	static async bulkRemove(collectionName: string, itemIds: Array<string>, options: object = null): Promise<void>
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixData.remove(...)", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixData.remove(...)", collectionName, "The name of the collection, not empty.");
		
		if(!JsTypes.isArray(itemIds))
			throw new VariableTypeError(PATH, "WixData.bulkRemove()", itemIds, "array<string>");
		if(JsTypes.isEmpty(itemIds))
			throw new VariableValueError(PATH, "WixData.bulkRemove()", itemIds, "An array with the ids of the items, not empty.");
		
		try
		{
			await wixData.bulkRemove(collectionName, itemIds, options);
		}catch(err)
		{
			throw new ForeignError(PATH, "WixData.bulkRemove(...)", err);
		}
	}
}

export default WixData;