const PATH = "public/src/main/common/util/jsTypes/JsTypes.js";

/**
 * @class
 * Provides helper methods for type checking.
 */
class JsTypes
{
	/**
	 * Check if the given object is a js primitive (boolean or number or string).
	 * @param {?} [o] [The object to be checked for.]
	 */
	static isPrimitive(o)
	{
		if(["string", "boolean", "number"].indexOf(typeof(o)) > -1)
			return true;
		return false;
	}

	/**
	 * Check if the given object is a number.
	 * @param {?} [o] [The object to be checked for.]
	 */
	static isNumber(o)
	{
		if(typeof(o) === "number" && !isNaN(o))
			return true;
		return false;
	}

	/**
	 * Check if the given object is empty (null or undefined or an empty string).
	 * @param {?} [o] [The object to be checked for.]
	 */
	static isEmpty(o)
	{
		if(o === null || o === undefined)
			return true;
		if(JsTypes.isString(o) && o === "")
			return true;
		return false;
	}

	/**
	 * Check if the given object is a function.
	 * @param {?} [o] [The object to be checked for.]
	 */
	static isFunction(o)
	{
		return typeof(o) === "function";
	}

	/**
	 * Check if the given object is an array.
	 * @param {?} [o] [The object to be checked for.]
	 */
    static isArray(o)
    {
        return Array.isArray(o);
    }

    /**
	 * Check if the given object is a string.
	 * @param {?} [o] [The object to be checked for.]
	 */
    static isString(o)
    {
    	return typeof(o) === "string";
    }

    /**
	 * Check if the given object is a boolean.
	 * @param {?} [o] [The object to be checked for.]
	 */
    static isBoolean(o)
    {
    	return typeof(o) === "boolean";
    }

    /**
	 * Check if the given object is of type object and not null.
	 * @param {?} [o] [The object to be checked for.]
	 */
    static isObject(o)
    {
    	return typeof(o) === "object" && !JsTypes.isEmpty(o);
    }
}

export default JsTypes