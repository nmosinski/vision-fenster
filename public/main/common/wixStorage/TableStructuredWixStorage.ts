const PATH = "public/main/common/wixStorage/TableStructuredWixStorage.js";

import AbstractWixStorage from "public/main/common/wixStorage/AbstractWixStorage.js"
import VariableTypeError from "public/main/common/util/error/VariableTypeError.js";
//import List from "public/main/common/util/list/List.js"

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
	protected _storage: any;
	/**
	 * Create a wix storage repository.
	 * @param {AbstractWixStorage} storage - The specific storage to be used.
	 */
	constructor(storage: AbstractWixStorage)
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
	getItem(tableName: string, id: string): object
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
	saveItem(tableName: string, id: string, item: any): void
	{
		this._storage.setItem(tableName+id, item);
	}

	/**
	 * Remove an item.
	 * @param {string} tableName - The name of the table.
	 * @param {string} id - The id of the item.
	 */
	removeItem(tableName: string, id: string): void
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
	removeAll(): void
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
	set storage(storage: AbstractWixStorage)
	{
		if(!(storage instanceof AbstractWixStorage))
			throw new VariableTypeError(PATH, "WixStorageManager.set storage()", storage, "AbstractWixStorage");

		this._storage = storage;
	}

	/**
	 * Get the storage.
	 * @return {AbstractWixStorage} The storage.
	 */
	get storage(): AbstractWixStorage
	{
		return this._storage;
	}
}

export default TableStructuredWixStorage;
