const PATH = "public/main/feature/shoppingCart/model/ProductOption.js";

import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an option of a product.
 */
class ProductOption

{
	private _type: string;
	private _variant: string;
	/**
	 * Create ProductOption.
	 * @param {string} type - The type of this product option.
	 * @param {string} variant - The variant of this product option.
	 */
	constructor(type: string, variant: string)
	{
		this.type = type;
		this.variant = variant;

	}

	/**
	 * Get type.
	 * @return {string} The type.
	 */
	get type(): string
	{
		return this._type;
	}

	/**
	 * Get variant.
	 * @return {string} The variant.
	 */
	get variant(): string
	{
		return this._variant;
	}

	/**
	 * Set type.
	 * @param {string} type - The type.
	 */
	set type(type: string)
	{
		if(!JsTypes.isString(type))
			throw new VariableTypeError(PATH, "ProductOption.set type()", type, "string");
		if(JsTypes.isEmpty(type))
			throw new VariableValueError(PATH, "ProductOption.set type()", type, "Not empty");
		
		this._type = type;
	}

	/**
	 * Set variant.
	 * @param {string} variant - The variant of this productOption.
	 */
	set variant(variant: string)
	{
		if(!JsTypes.isString(variant))
			throw new VariableTypeError(PATH, "ProductOption.set variant()", variant, "string");
		if(JsTypes.isEmpty(variant))
			throw new VariableValueError(PATH, "ProductOption.set variant()", variant, "Not empty");
		
		this._variant = variant;
	}
}

export default ProductOption;