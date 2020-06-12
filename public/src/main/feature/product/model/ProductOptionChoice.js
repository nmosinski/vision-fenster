const PATH = "public/src/main/feature/product/model/ProductOptionChoice.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js"
import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an option choice of a product.
 */
class ProductOptionChoice extends(IComparable(IClonable()))
{
	/**
	 * Create ProductOptionChoice.
	 * @param {ProductOptionType} [productOptionType] The type of this product option.
	 * @param {ProductOptionVariant} [productOptionVariant] One of the variants of this product option.
	 */
	constructor(productOptionType, productOptionVariant)
	{
		super();
		this.productOptionType = productOptionType;
		this.productOptionVariant = productOptionVariant;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof ProductOptionChoice))
			return false;
		if(!this._productOptionType.equals(o.productOptionType))
			return false;
		if(!this._productOptionVariant.equals(o.productOptionVariant))
			return false;
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	clone()
	{
		return new ProductOptionChoice(this.productOptionType, this.productOptionVariant);
	}

	/**
	 * Get productOptionType.
	 * @return {ProductOptionType} The type.
	 */
	get productOptionType()
	{
		return this._productOptionType.clone();
	}

	/**
	 * Get productOptionVariant.
	 * @return {ProductOptionVariant} The productOptionVariant.
	 */
	get productOptionVariant()
	{
		return this._productOptionVariant.clone();
	}

	/**
	 * Set productOptionType.
	 * @param {ProductOptionType} [productOptionType] The type.
	 */
	set productOptionType(productOptionType)
	{
		if(!(productOptionType instanceof ProductOptionType))
			throw new VariableTypeError(PATH, "ProductOptionChoice.set productOptionType()", productOptionType, "ProductOptionType");
		this._productOptionType = productOptionType.clone();
	}

	/**
	 * Set productOptionVariant.
	 * @param {ProductOptionVariant} [productOptionVariant] One of the productOptionVariants that belong to this productOption.
	 */
	set productOptionVariant(productOptionVariant)
	{
		if(!(productOptionVariant instanceof ProductOptionVariant))
			throw new VariableTypeError(PATH, "ProductOptionChoice.set productOptionVariant()", productOptionVariant, "ProductOptionVariant");
		this._productOptionVariant = productOptionVariant.clone();
	}
}

export default ProductOptionChoice