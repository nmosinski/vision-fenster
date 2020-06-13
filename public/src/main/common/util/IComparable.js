const PATH = "public/src/main/common/util/IComparable.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

/**
 * @interface
 * Marks an object as comparable.
 */
const IComparable = (superclass=null) => 
{
	Object.defineProperty(IComparable, Symbol.hasInstance, {value: function(instance) { return JsTypes.isFunction(instance.equals); }, configurable: true});

	/**
	 * @alias IComparable
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Compares an object to this object checking for equality.
		 * @param  {Object} object - The object this object will be compared to.
		 * @return {boolean} True if objects are equal, else false.
		 * @abstract
		 */
		equals(object){throw new NotImplementedError(PATH, "IComparable.equals()");}

	}

	return C;
}

export default IComparable;