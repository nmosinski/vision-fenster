const PATH = "public/src/main/common/wixStorage/AbstractWixStorage.js";

import List from "public/src/main/common/util/list/List.js"

/**
 * @class
 * A class representing a wrapper for a WixStorage.
 */
class AbstractWixStorage
{
	/**
	 * Create an AbstractWixStorage
	 * @param {wix-storage} storage - A specific wix-storage.
	 */
	constructor(storage)
	{
		this.storage = storage;
	}

	/**
	 * Get an item by the key.
	 * @param {string} key - The key.
	 * @return {stirng} The value stored behind the key.
	 */
	getItem(key)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.getItem(), key, string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.getItem(), key, not empty");

		return this._storage.getItem();
	}

	/**
	 * Set an item.
	 * @param {string} key - The items key.
	 * @param {string} value - The value to be stored.
	 */
	setItem(key, value)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.setItem(), key, string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.setItem(), key, not empty");
		if(!JsTypes.isString(value))
			throw new VariableTypeError(PATH, "AbstractWixStorage.setItem(), value, string");
		if(JsTypes.isEmpty(value))
			throw new VariableValueError(PATH, "AbstractWixStorage.setItem(), value, not empty");

		this._storage.setItem(key, value);
	}

	/**
	 * Remove an item by the key.
	 * @param {string} key - The key.
	 */
	removeItem(key)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.removeItem(), key, string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.removeItem(), key, not empty");

		this._storage.removeItem(key);
	}

	/**
	 * Clear the complete storage.
	 */
	clear()
	{
		this._storage.clear();
	}

	/**
	 * Set storage.
	 * @param {wix-storage} storage - The storage to be set.
	 */
	set storage(storage)
	{
		if(JsTypes.isUnspecified(storage))
			throw new VariableTypeError(PATH, "AbstractWixStorage.set storage(), storage, wix-storage");

		this._storage = storage;
	}

	/**
	 * Get storage.
	 * @return {wix-storage} The storage.
	 */
	get storage()
	{
		return this._storage;
	}
}

export default AbstractWixStorage;