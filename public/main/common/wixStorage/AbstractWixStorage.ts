const PATH = "public/main/common/wixStorage/AbstractWixStorage.js";

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/main/common/util/error/VariableTypeError.js";
import VariableValueError from "public/main/common/util/error/VariableValueError.js";

/**
 * @class
 * A class representing a wrapper for a WixStorage.
 */
class AbstractWixStorage
{
	protected _storage: any;
	/**
	 * Create an AbstractWixStorage
	 * @param {any} storage - A specific wix-storage.
	 */
	constructor(storage: any)
	{
		this.storage = storage;
	}

	/**
	 * Get an item by the key.
	 * @param {string} key - The key.
	 * @return {string} The value stored behind the key.
	 */
	getItem(key: string): string
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.getItem()", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.getItem()", key, "not empty");

		return this._storage.getItem();
	}

	/**
	 * Set an item.
	 * @param {string} key - The items key.
	 * @param {string} value - The value to be stored.
	 */
	setItem(key: string, value: string): void
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.setItem()", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.setItem()", key, "not empty");
		if(!JsTypes.isString(value))
			throw new VariableTypeError(PATH, "AbstractWixStorage.setItem()", value, "string");
		if(JsTypes.isEmpty(value))
			throw new VariableValueError(PATH, "AbstractWixStorage.setItem()", value, "not empty");

		this._storage.setItem(key, value);
	}

	/**
	 * Remove an item by the key.
	 * @param {string} key - The key.
	 */
	removeItem(key: string): void
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "AbstractWixStorage.removeItem()", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "AbstractWixStorage.removeItem()", key, "not empty");

		this._storage.removeItem(key);
	}

	/**
	 * Clear the complete storage.
	 */
	clear(): void
	{
		this._storage.clear();
	}

	/**
	 * Set storage.
	 * @param {any} storage - The storage to be set.
	 */
	protected set storage(storage: any)
	{
		if(JsTypes.isUnspecified(storage))
			throw new VariableTypeError(PATH, "AbstractWixStorage.set storage()", storage, "wix-storage");

		this._storage = storage;
	}

	/**
	 * Get storage.
	 * @return {any} The storage.
	 */
	protected get storage(): any
	{
		return this._storage;
	}
}

export default AbstractWixStorage;