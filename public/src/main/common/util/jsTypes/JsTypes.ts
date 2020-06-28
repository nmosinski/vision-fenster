const PATH = "public/src/main/common/util/jsTypes/JsTypes.js";

/**
 * @class
 * Provides helper methods for type checking.
 */
class JsTypes
{
	/**
	 * Check if the given object is a js primitive (boolean or number or string).
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is primitive, else false.
	 */
	static isPrimitive(o: any): boolean
	{
		if(["string", "boolean", "number"].indexOf(typeof(o)) > -1)
			return true;
		return false;
	}

	/**
	 * Check if the given object is a number.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is a number, else false.
	 */
	static isNumber(o: any): boolean
	{
		if(typeof(o) === "number" && !isNaN(o))
			return true;
		return false;
	}

	/**
	 * Check if the given object is empty (null or undefined or an empty string).
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is an empty string, an empty array or an object without attributes, else false.
	 */
	static isEmpty(o: any): boolean
	{
		if(JsTypes.isString(o) && o === "")
			return true;
		if(JsTypes.isArray(o) && o.length === 0)
			return true;
		if(JsTypes.isObject(o) && Object.keys(o).length === 0)
			return true;
			
		return false;
	}

	/**
	 * Check if the given object is unspecified (null or undefined).
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is null or undefined, else false.
	 */
	static isUnspecified(o: any): boolean
	{
		if(o === null || o === undefined)
			return true;

		return false;
	}

	/**
	 * Check if the given object is a function.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is a function, else false.
	 */
	static isFunction(o: any): boolean
	{
		return typeof(o) === "function";
	}

	/**
	 * Check if the given object is an array.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is an array, else false.
	 */
    static isArray(o: any): boolean
    {
        return Array.isArray(o);
    }

    /**
	 * Check if the given object is a string.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is a string, else false.
	 */
    static isString(o: any): boolean
    {
    	return typeof(o) === "string";
    }

    /**
	 * Check if the given object is a boolean.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is boolean, else false.
	 */
    static isBoolean(o: any): boolean
    {
    	return typeof(o) === "boolean";
    }

    /**
	 * Check if the given object is of type object and not null.
	 * @param {any} o The object to be checked for.
	 * @returns {boolean} True if is an object and not unspecified, else false.
	 */
    static isObject(o: any): boolean
    {
    	return typeof(o) === "object" && !JsTypes.isUnspecified(o);
    }
}

export default JsTypes;