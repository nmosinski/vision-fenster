const PATH = "public/src/main/common/util/map/KVMap.js";

import IComparable from "public/src/main/common/util/IComparable.js";

import List from "public/src/main/common/util/list/List.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a KVMap (Key-Value-Map).
 * @param {elements} [elements=null] Create a KVMap from the given object.
 */
class KVMap extends IComparable()
{
	/**
	 * Create a KVMap.
	 */
	constructor(elements={})
	{
        super();
		this._elements = {};
       	if(JsTypes.isObject(elements))
       		for(let idx in Object.keys(elements))
       			this.add(Object.keys(elements)[idx], elements[Object.keys(elements)[idx]]);
		
	}

    /**
     * Check if another map equals this map.
     * @override
     */
    equals(object)
    {
        if(!(object instanceof KVMap))
            return false;
        
        for(let idx = 0; idx < object.keys().length; idx++)
        {
            let key = object.keys().get(idx);
            if(!this.hasAny(key))
                return false;
            if(!object.get(key).equals(this.get(key)))
                return false;
        }

        if(!this.keys().length === object.keys().length)
        	return false;

        return true;
    }

    /**
     * Transform this map to an object containing the keys and values.
     * @return {object} This map as an object.
     */
    toObject()
    {
    	let o = {};
    	this.keys().foreach((k)=>o[k] = this.get(k));
    	return o;
    }

	/**
	 * Get a value corresponding to the key.
	 * @param {string} key - The key.
	 * @return {?} The corresponding value.
	 */
	get(key)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "KVMap.get(key)", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "KVMap.get(key)", key, "A not empty string");
		
		return this._elements[key];
	}

	/**
	 * Add a key-value pair.
	 * @param {string} key - The key.
	 * @param {?} value - The value.
	 */
	add(key, value)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "KVMap.add(key, value)", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "KVMap.add(key, value)", key, "A not empty string");

		this._elements[key] = value;
	}

	/**
	 * Delete a key-value pair.
	 * @param {string} key - The key of the key-value pair to be deleted.
	 */
	delete(key)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "KVMap.add(key, value)", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "KVMap.add(key, value)", key, "A not empty string");
		
		delete this._elements.key;
	}

	/**
	 * Check if the map has value.
	 * @param {?} value - The value to be checked for.
	 * @return {boolean} True if the map has value, else false.
	 */
	has(value)
	{
        let values = this.values();
		for(let idx = 0; idx < values.length; idx++)
		{
			if(values.get(idx) instanceof IComparable)
			{
				if(values.get(idx).equals(value))
				{
					return true;
				}
			}
			else
			{
				if(values.get(idx) === value)
					return true;
			}
		}

		return false;
	}

	/**
	 * Check if the map has any value mapped to the given key.
	 * @param {string} key - The key.
	 * @return {boolean} True, if a value is mapped to the key, else false.
	 */
	hasAny(key)
	{
		if(!JsTypes.isString(key))
			throw new VariableTypeError(PATH, "KVMap.hasAny(key, value)", key, "string");
		if(JsTypes.isEmpty(key))
			throw new VariableValueError(PATH, "KVMap.hasAny(key, value)", key, "A not empty string");
		
		if(this.keys().has(key))
			return true;
		return false;
	}

    /**
     * Get all keys.
     * @return {List<string>} A list with all keys.
     */
	keys()
	{
		return new List(Object.keys(this._elements));
	}

    /**
     * Get all values.
     * @return {List<?>} A list with all values.
     */
	values()
	{
		return new List(Object.values(this._elements));
	}

	/**
	 * Create a copy of this KVMap that refers to the same elements.
	 * @return {KVMap} A shallow copy of this KVMap.
	 */
	shallowCopy()
	{
		return new KVMap(this.toObject());
	}
}

export default KVMap;