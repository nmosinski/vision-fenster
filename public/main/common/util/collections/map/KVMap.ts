import IComparable from "../../IComparable";
import JsTypes from "../../jsTypes/JsTypes";
import VariableTypeError from "../../error/VariableTypeError";
import List from "../list/List";

const PATH = "public/main/common/util/map/KVMap.js";



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
			if(!this.elementsEqual(object.get(key), this.get(key)))
				return false;
		}

		

		return true;
	}

		/**
	 * Iterate through all elements of this map and calls the passed function.
	 * @param {Function} f - The function to be called by each element of this map.
	 */
    foreach(f: (k: K, v:V) => void): void
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "KVMap.foreach(f)", f, "function");

			for(let [key, value] of this._elements.entries()) 
			{
				f(key, value);
			}
	}
	
	/**
	 * Iterate through all elements of this map and calls the passed async function.
	 * @param {Function} f - The function to be called by each element of this map.
	 */
    async foreachAsync(f: (k: K, v:V) => void): Promise<void>
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "KVMap.foreachAsync(f)", f, "function");

			for(let [key, value] of this._elements.entries()) 
			{
				await f(key, value);
			}
    }

	/**
	 * Return a new KVMap containing only those items that are in this KVMap and the one passed as argument.
	 * @param {KVMap<K,V>} map - The other map.
	 * @return {KVMap<K,V>} A new KVMap containing items that are in both maps.
	 */
	AND(map: KVMap<K,V>): KVMap<K,V>
	{
		if(!(map instanceof KVMap))
			throw new VariableTypeError(PATH, "KVMap.AND()", map, "KVMap<K,V>");
		
		return this.filter((k:K, v:V)=>{return this.elementsEqual(map.getKeyOf(v), k) && this.elementsEqual(map.get(k), this.get(k));});
	}

	/**
	 * Return a new map containing all items that are in this map or the one passed as argument.
	 * @param {KVMap<K,V>} map - The other map.
	 * @return {KVMap<K,V>} A new KVMap containing all items from both maps.
	 */
	OR(map: KVMap<K,V>): KVMap<K,V>
	{
		if(!(map instanceof KVMap))
			throw new VariableTypeError(PATH, "KVMap.AND()", map, "KVMap<K,V>");
		
		let m = new KVMap<K,V>(this.toMap());

		map.foreach((k:K, v:V) => {
			if(! (this.elementsEqual(map.getKeyOf(v), k) && this.elementsEqual(map.get(k), this.get(k))) )
				m.add(k,v);
		});
		return m;
	}

    /**
     * Filters all elements of this map by the given expression and returns a new map with the elements that match.
     * @param {Function} f A function representing the filtering expression.
     * @return {KVMap<K,V>} A new map with the filtered elements.
     */
    filter(f: (k:K, v:V) => boolean): KVMap<K,V>
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "KVMap.filter(f)", f, "function");

    	let ret = new KVMap<K,V>();

		this.foreach((k:K, v:V) => {
			if(f(k,v))
				ret.add(k,v);
		});

		return ret;
	}

	/**
	 * Get the key of a value.
	 * @param {V} value The value of which the key will be returned.
	 * @returns {K} The key or null if not found.
	 */
	getKeyOf(value: V): K
	{
		this.foreach((k,v)=>{
			if(this.elementsEqual(v,value))
				return k;
		});
		return null;
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
		this.foreach((k:K, v:V) => {
			if(this.elementsEqual(k, key))
				return v;
		});

		return null;
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
			if(!this.elementsEqual(k, key))
				m.set(k,v);
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
			if(this.elementsEqual(values.get(idx), value))
				return true;
		}

		return false;
	}

	/**
	 * Check if two elements are equal.
	 * @param e1 The element to be compared to e2.
	 * @param e2 The element to be compared to e1.
	 * @returns {boolean} True if elements are equal, else false.
	 */
	protected elementsEqual(e1: any, e2: any): boolean
	{
		try
		{
			//@ts-ignore
			if(e1.equals(e2))
				return true;
		}
		catch
		{
			if(e1 === e2)
				return true;
		}
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
				//@ts-ignore
				key = k.clone();
			}
			catch(err)
			{
				key = k;
				
			}

			try
			{
				//@ts-ignore
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