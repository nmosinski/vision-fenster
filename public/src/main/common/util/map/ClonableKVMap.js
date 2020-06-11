const PATH = "public/src/main/common/util/map/ClonableKVMap.js";

import KVMap from "public/src/main/common/util/map/KVMap.js";
import IClonable from "public/src/main/common/util/IClonable.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a ClonableKVMap (Clonable Key-Value-Map).
 */
class ClonableKVMap extends IClonable(KVMap)
{
	/**
	 * Create a ClonableKVMap.
	 * @param {elements} [elements=null] Create a ClonableKVMap from the given object.
	 */
	constructor(elements={})
	{
		super();
		if(JsTypes.isObject(elements))
       		for(let idx in Object.keys(elements))
       			this.add(Object.keys(elements)[idx], elements[Object.keys(elements)[idx]]);
	}

	/**
	 * Add a key-value pair.
	 * @typedef {(IComparable | IClonable)} IComparableANDIClonable
	 * @param {string} key - The key.
	 * @param {IComparableANDIClonable | string | number | boolean} value - The value.
	 * @throws {VariableTypeError} If key is not a string and/or value is not IComparable and IClonable or primitive.
	 * @throws {VariableValueError} If key is an empty string.
	 */
	add(key, value)
	{
		if(! value instanceof IClonable)
			throw new VariableTypeError(PATH, "ClonableKVMap.add(key, value)", value, "IClonable and IComparable");
		super.add(key, value);
	}

	/**
	 * Clone this map.
	 * @return {ClonableKVMap<string, IComparableANDIClonable | string | boolean | number>} A copy of this map.
	 */
	clone()
	{
		let map = new ClonableKVMap();

		for(let idx = 0; idx < this.keys().length(); idx++)
		{
			let k = this.keys().get(idx);
			if(this.get(k) instanceof IClonable)
				map.add(k, this.get(k).clone());
			else
				map.add(k, this.get(k));
		}
		
		return map;
	}
}

export default ClonableKVMap;