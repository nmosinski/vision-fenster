const PATH = "public/main/common/util/map/KVMap.js";

import IComparable from "./public/src/main/common/util/IComparable.js";

import List from "../list/List.js";

import VariableTypeError from "./public/src/main/common/util/error/VariableTypeError.js"

import JsTypes from "./public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a KVMap (Key-Value-Map).
 */
class KVMap<K,V> implements IComparable
{
	private _elements: Map<K,V>;
	/**
	 * Create a KVMap.
	 * @param {Map<K,V>} [map: Map<K,V>=null] Create a KVMap from the given Map.
	 */
	constructor(map: Map<K, V>=null)
	{
		this._elements = new Map<K,V>();
		if(map instanceof Map)
		{
			for(let [key, value] of map.entries()) 
			{
				this._elements.set(key, value);
			}
		}
	}

	/**
	 * Check if another map equals this map.
	 * @override
	 */
	equals(object: any): boolean
	{
		if(!(object instanceof KVMap))
			return false;
		
		if(!(this.keys().length === object.keys().length))
			return false;

		for(let idx = 0; idx < object.keys().length; idx++)
		{
			let key = object.keys().get(idx);
			if(!this.hasKey(key))
				return false;
			try
			{
				if(!(object.get(key).equals(this.get(key))))
					return false;
			}catch(err)
			{
				if(!(object.get(key) === this.get(key)))
					return false;
			}
		}

		

		return true;
	}

		/**
	 * Iterate through all elements of this list and calls the passed function.
	 * @param {Function} f - The function to be called by each element of this list.
	 */
    foreach(f: (k: K, v:V) => void): void
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

			for(let [key, value] of this._elements.entries()) 
			{
				f(key, value);
			}
    }

    /**
     * Filters all elements of this map by the given expression and returns a new map with the elements that match.
     * @param {Function} f A function representing the filtering expression.
     * @return {KVMap<K,V>} A new map with the filtered elements.
     */
    filter(f: (k:K, v:V) => boolean): KVMap<K,V>
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

    	let ret = new KVMap<K,V>();

		this.foreach((k:K, v:V) => {
			if(f(k,v))
				ret.add(k,v);
		});

		return ret;
    }
	/**
	 * Transform this map to an object containing the keys and values.
	 * @return {Map<K,V>} This map as an object.
	 */
	toMap(): Map<K,V>
	{
		let m = new Map<K,V>();
		this.foreach((k:K,v:V) => {m.set(k,v)});
		return m;
	}

	/**
	 * Get a value corresponding to the key.
	 * @param {K} key - The key.
	 * @return {V} The corresponding value.
	 */
	get(key: K): V
	{
		let ret = null;
		this.foreach((k:K, v:V) => {
			try
			{
				if(k.equals(key))
					ret = v;
			}
			catch(err)
			{
				if(k === key)
					ret = v;
			}
		});

		return ret;
	}

	/**
	 * Add a key-value pair.
	 * @param {K} key - The key.
	 * @param {V} value - The value.
	 */
	add(key: K, value: V): void
	{
		this._elements.set(key, value);
	}

	/**
	 * Remove a key-value pair.
	 * @param {K} key - The key of the key-value pair to be deleted.
	 */
	remove(key: K): void
	{
		let m = new Map<K,V>();
		this.foreach((k:K,v:V)=>{
			try
			{
				if(!k.equals(key))
					m.set(k,v);
			}
			catch(err)
			{
				if(k !== key)
					m.set(k,v);
			}
		});

		this._elements = m;
	}

	/**
	 * Check if the map has value.
	 * @param {any} value - The value to be checked for.
	 * @return {boolean} True if the map has value, else false.
	 */
	has(value: any): boolean
	{
		let values = this.values();
		for(let idx = 0; idx < values.length; idx++)
		{
			try
			{
				if(values.get(idx).equals(value))
				{
					return true;
				}
			}
			catch
			{
				if(values.get(idx) === value)
					return true;
			}
		}

		return false;
	}

	/**
	 * Check if the map has any value mapped to the given key.
	 * @param {K} key - The key.
	 * @return {boolean} True, if a value is mapped to the key, else false.
	 */
	hasKey(key: K): boolean
	{
		if(this.keys().has(key))
			return true;
		return false;
	}

	/**
	 * Get all keys.
	 * @return {List<K>} A list with all keys.
	 */
	keys(): List<K>
	{
		let l = new List<K>();
		
		for(let key of this._elements.keys())
		{
			l.add(key);
		}

		return l;
	}

	/**
	 * Get all values.
	 * @return {List<V>} A list with all values.
	 */
	values(): List<V>
	{
		let l = new List<V>();
		
		for(let value of this._elements.values())
		{
			l.add(value);
		}

		return l;
	}

	/**
	 * Create a copy of this KVMap. If Elements are clonable, they will be cloned.
	 * @return {KVMap<K,V>} A copy of this KVMap.
	 */
	copy(): KVMap<K,V>
	{
		let m = new KVMap<K,V>();
		
		let key: K;
		let value: V;
		this.foreach((k:K,v:V)=>{
			try
			{
				key = k.clone();
			}
			catch(err)
			{
				key = k;
				
			}

			try
			{
				value = v.clone();
			}
			catch(err)
			{
				value = v;
			}
			m.add(key, value);
		});

		return m;
	}

	/**
	 * Check if map is empty.
	 * @return {boolean} True if empty, else false.
	 */
	isEmpty(): boolean
	{
		return this.length === 0;
	}

	get length(): number
	{
		return this._elements.size;
	}

	/**
	 * @param {Map<K,V>} elements
	 */
	private set elements(elements: Map<K, V>)
	{
		this._elements = elements;
	}
}

	export default KVMap;