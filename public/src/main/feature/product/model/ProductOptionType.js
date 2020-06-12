const PATH = "public/src/main/feature/product/model/ProductOptionType.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a type of an option of a product.
 */
class ProductOptionType extends IComparable(AbstractEntity)
{
	/**
	 * Create ProductOptionType.
	 * @param {string} [id] The id of this entity.
	 * @param {string} [productModelId] The id of the product model this product option belongs to.
	 * @param {string} [title] The title of this product option type.
	 */
	constructor(id, productModelId, title)
	{
		super(id);
		this.productModelId = productModelId;
		this.title = title;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(! (o instanceof ProductOptionType))
			return false;
		if(!this.id === o.id)
			return false;
		if(!this.productModelId === o.productModelId)
			return false;
		if(!this.title === o.title)
			return false;
		return true;
	}

	/**
	 * Get productModelId.
	 * @return {string} The id of the product model.
	 */
	get productModelId()
	{
		return this._productModelId;
	}

	/**
	 * Get title.
	 * @return {string} The title.
	 */
	get title()
	{
		return this._title;
	}

	/**
	 * Set productModelId.
	 * @param {string} [productModelid] The id of the product model this product option belongs to.
	 */
	set productModelId(id)
	{
		if(!JsTypes.isString(id))
			throw new VariableTypeError(PATH, "ProductOptionType.set productModelId()", id, "string");
		if(JsTypes.isEmpty(id))
			throw new VariableValueError(PATH, "ProductOptionType.set productModelId()", id, "Not empty string");
		this._productModelId = id;
	}

	/**
	 * Set title.
	 * @param {string} [title] The title.
	 */
	set title(title)
	{
		if(!JsTypes.isString(title))
			throw new VariableTypeError(PATH, "ProductOptionType.set title()", title, "string");
		if(JsTypes.isEmpty(title))
			throw new VariableValueError(PATH, "ProductOptionType.set title()", title, "Not empty string");
		this._title = title;
	}
}

export default ProductOptionType