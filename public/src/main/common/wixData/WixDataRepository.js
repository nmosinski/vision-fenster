const PATH = "public/src/main/common/wixData/WixDataRepository.js";

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
	 * @param {boolean} [authorisation=true] [Defines if authorisation should be done.]
	 * @param {boolean} [hooks=true] [Defines if hooks should be considered.]
	 * @throws {VariableTypeError} If collectionName is not a string or authorisation and/or hooks are not boolean.
	 * @throws {VariableValueError} If collectionName is empty.
	 */
	constructor(collectionName, authorisation=true, hooks=true)
	{
		if(!JsTypes.isString(collectionName))
			throw new VariableTypeError(PATH, "WixDataRepository.constructor(...)", collectionName, "string");
		if(JsTypes.isEmpty(collectionName))
			throw new VariableValueError(PATH, "WixDataRepository.constructor(...)", collectionName, "The name of the collection, not empty.");

		if(!JsTypes.isBoolean(authorisation))
			throw new VariableTypeError(PATH, "WixDataRepository.constructor(...)", authorisation, "boolean");

		if(!JsTypes.isBoolean(hooks))
			throw new VariableTypeError(PATH, "WixDataRepository.constructor(...)", hooks, "hooks");
		
		this._collectionName = collectionName;
		this._options = {"suppressAuth": !authorisation, "suppressHooks": !hooks};
	}

	/**
	 * Retrieves an item with the given id.
	 * @param {string} [itemId] [The id of the item to be retrived.]
	 * @return {object | null} The retrieved item or null if there was no item with the given id.
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If itemId is not a string.
	 * @throws {VariableValueError} If itemId is empty.
	 */
	async get(itemId)
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.get()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.get()", itemId, "The id of the item, not empty.");

		return WixData.get(this._collectionName, itemId, this._options).then((item) => {return item;});
	}

	/**
	 * Get a query that specifies an item selection.
	 * @param {number} [itemLimit=50] [The limit of the number of items to be retrieved.]
	 * @return {wix-data.query} [The query.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If itemLimit is not a number.
	 * @throws {VariableValueError} If itemLimit is < 1.
	 */
	query(itemLimit = 50)
	{
		if(!JsTypes.isNumber())
			throw new VariableTypeError(PATH, "WixDataRepository.query()", itemLimit, "number");
		if(itemLimit < 1)
			throw new VariableValueError(PATH, "WixDataRepository.query()", itemLimit, "Limit > 0");

		return WixData.query(this._collectionName, itemLimit, this._options);
	}

	/**
	 * Executes a query.
	 * @param {wix-data.query} [query] [The query to be executed.]
	 * @return {Object} [An object representing the results of the executed query.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If query is empty.
	 */
	async find(query)
	{
		if(JsTypes.isEmpty(query))
			throw new VariableTypeError(PATH, "WixDataRepository.find()", query, "A wix-data query.");

		return query.find().then((result) => {return result;});
	} 

	/**
	 * Inserts an item.
	 * @param {object} [item] [An object representing the item to be inserted.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If item is empty.
	 */
	insert(item)
	{
		if(JsTypes.isEmpty(item))
			throw new VariableTypeError(PATH, "WixDataRepository.insert()", item, "Object.");

		WixData.insert(this._collectionName, item, this._options);
	}

	/**
	 * Saves an item. If the item already exists, it will be overwritten.
	 * @param {object} [item] [An object representing the item to be saved.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If item is empty.
	 */
	save(item)
	{
		if(JsTypes.isEmpty(item))
			throw new VariableTypeError(PATH, "WixDataRepository.save()", item, "Object.");

		WixData.save(item);
	}

	/**
	 * Updates an item.
	 * @param {object} [item] [An object that describes the item to be updated.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If item is empty.
	 */
	update(item)
	{
		if(JsTypes.isEmpty(item))
			throw new VariableTypeError(PATH, "WixDataRepository.update()", item, "Object.");

		WixData.update(this._collectionName, item, this._options);
	}

	/**
	 * Removes an item.
	 * @param {string} [itemId] [The id of the item to be removed.]
	 * @throws {ForeignError} If the wix-data library throws an error.
	 * @throws {VariableTypeError} If itemId is not a string.
	 * @throws {VariableValueError} If itemId is empty.
	 */
	remove(itemId)
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.remove()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.remove()", itemId, "The id of the item, not empty.");

		WixData.remove(this._collectionName, itemId, this._options);
	}
}

export default WixDataRepository