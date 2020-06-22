const PATH = "public/src/main/common/wixStorage/TableStructuredWixStorage.js";

import AbstractWixStorage from "public/src/main/common/wixStorage/AbstractWixStorage.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

//import List from "public/src/main/common/util/list/List.js"

/*
class MetaInfo
{
	constructor()
	{

	}

	set tableName(name)
	{
		this._tableName = name;
	}

	set itemsCount(count)
	{
		this._itemsCount = count;
	}

	get tableName()
	{
		return this._tableName;
	}

	get itemsCount()
	{
		return this._itemsCount;
	}
}
*/

/**
 * @class
 * A class representing a table structured wix storage.
 */
class TableStructuredWixStorage
{
	/**
	 * Create a wix storage repository.
	 * @param {AbstractWixStorage} storage - The specific storage to be used.
	 */
	constructor(storage)
	{
		this._storage = storage;
		//this._META_KEY = "META";
	}

	/**
	 * Get an item.
	 * @param {string} tableName - The name of the table.
	 * @param {string} id - The id of the item.
	 * @return {object} The item.
	 */
	getItem(tableName, id)
	{
		let item = this._storage.get(tableName+id);
		return item;
	}

	/*
	getAllItems(tableName)
	{
		let items = new List();

		
	}
	*/

	/**
	 * Save an item. 
	 * @param {string} tableName - The name of the table.
	 * @param {string} id - The id of the item.
	 * @param {?} item - The item to be stored.
	 */
	saveItem(tableName, id, item)
	{
		this._storage.setItem(tableName+id, item);
	}

	/**
	 * Remove an item.
	 * @param {string} tableName - The name of the table.
	 * @param {string} id - The id of the item.
	 */
	removeItem(tableName, id)
	{
		this._storage.removeItem(tableName+id);
	}

	/*
	removeAllItems(tableName)
	{

	}
	*/

	/**
	 * Remove all items.
	 */
	removeAll()
	{
		this._storage.clear();
	}

	/*
	count(tableName)
	{

	}

	_indexOf(tableName, id)
	{

	}

	_tableExists(tableName)
	{

	}

	_tableMeta(tableName)
	{
		let item = this.getItem(tableName+this._META_KEY);
	}
	*/

	/**
	 * Set the storage.
	 * @param {AbstractWixStorage} storage - The storage.
	 */
	set storage(storage)
	{
		if(!(storage instanceof AbstractWixStorage))
			throw new VariableTypeError(PATH, "WixStorageManager.set storage(), storage, AbstractWixStorage");

		this._storage = storage;
	}

	/**
	 * Get the storage.
	 * @return {AbstractWixStorage} The storage.
	 */
	get storage()
	{
		return this._storage;
	}
}

export default TableStructuredWixStorage;
