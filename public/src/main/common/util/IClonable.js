const PATH = "public/src/main/common/util/IClonable.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

/**
 * @interface
 * Marks an object as clonable.
 */
const IClonable = (superclass=null) => 
{
	Object.defineProperty(IClonable, Symbol.hasInstance, {value: function(instance) { return JsTypes.isFunction(instance.clone); }, configurable: true});

	/**
	 * @alias IClonable
	 * @interface
	 */
	let C = class extends superclass
	{
		/**
		 * Clones this object.
		 * @return {?} A copy of this object.
		 * @abstract
		 */
		clone(){throw new NotImplementedError(PATH, "IClonable.clone()");}
	}

	return C;
}

export default IClonable;