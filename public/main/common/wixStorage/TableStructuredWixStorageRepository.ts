const PATH = "public/src/main/common/wixStorage/TableStructuredWixStorageRepository.js";

import TableStructuredWixStorage from "public/src/main/common/wixStorage/TableStructuredWixStorage.js"
import AbstractWixStorage from "public/src/main/common/wixStorage/AbstractWixStorage.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js";
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
 * A class representing a table structured wix storage repository.
 */
class TableStructuredWixStorageRepository extends TableStructuredWixStorage
{
	private _tableName: string;
	/**
	 * Create AbstractTableStructuredWixStorageRepository.
	 * @param {AbstractWixStorage} storage - The specific storage to be used.
	 * @param {string} name - The name of the table in which all entries will be stored.
	 */
	constructor(storage: AbstractWixStorage, tableName)
	{
		super(storage);
		this.tableName = tableName;
		//this._META_KEY = "META";
	}

	/**
	 * Get an item.
	 * @param {string} id - The id of the item.
	 * @return {object} The item.
	 */
	getItem(id: string): object
	{
		let item = super.getItem(this._tableName, id);
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
	 * @param {string} id - The id of the item.
	 * @param {any} item - The item to be stored.
	 */
	saveItem(id: string, item: any): void
	{
		super.saveItem(this._tableName, id, item);
	}

	/**
	 * Remove an item.
	 * @param {string} id - The id of the item.
	 */
	removeItem(id: string): void
	{
		super.removeItem(this._tableName, id);
	}

	/*
	removeAllItems(tableName)
	{

	}
	*/	

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
	 * Set table name.
	 * @param {string} tableName The name of the table.
	 */
	set tableName(tableName: string)
	{
		this._tableName = tableName
	}

	/**
	 * Get the storage.
	 * @return {AbstractWixStorage} The storage.
	 */
	get storage(): AbstractWixStorage
	{
		return this._storage;
	}

	/**
	 * Get table name.
	 * @return {string} The name of the table.
	 */
	get tableName(): string
	{
		return this._tableName;
	}
}

export default TableStructuredWixStorageRepository;
