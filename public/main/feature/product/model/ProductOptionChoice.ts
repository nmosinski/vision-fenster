const PATH = "public/main/feature/product/model/ProductOptionChoice.js";

import IComparable from "public/main/common/util/IComparable.js"
import IClonable from "public/main/common/util/IClonable.js"
import ProductOptionType from "public/main/feature/product/model/ProductOptionType.js"
import ProductOptionVariant from "public/main/feature/product/model/ProductOptionVariant.js"

import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"
import InvalidOperationError from "public/main/common/util/error/InvalidOperationError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an option choice of a product.
 */
class ProductOptionChoice implements IComparable<ProductOptionChoice>, IClonable<ProductOptionChoice>
{
	private _productOptionType: ProductOptionType;
	private _productOptionVariant: ProductOptionVariant;
	/**
	 * Create ProductOptionChoice.
	 * @param {ProductOptionType} productOptionType The type of this product option.
	 * @param {ProductOptionVariant} productOptionVariant One of the variants of this product option.
	 */
	constructor(productOptionType: ProductOptionType, productOptionVariant: ProductOptionVariant)
	{
		this.productOptionType = productOptionType;
		this.productOptionVariant = productOptionVariant;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o: ProductOptionChoice): boolean
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
	clone(): ProductOptionChoice
	{
		return new ProductOptionChoice(this.productOptionType, this.productOptionVariant);
	}

	/**
	 * Get productOptionType.
	 * @return {ProductOptionType} The type.
	 */
	get productOptionType(): ProductOptionType
	{
		return this._productOptionType.clone();
	}

	/**
	 * Get productOptionVariant.
	 * @return {ProductOptionVariant} The productOptionVariant.
	 */
	get productOptionVariant(): ProductOptionVariant
	{
		return this._productOptionVariant.clone();
	}

	/**
	 * Set productOptionType.
	 * @param {ProductOptionType} productOptionType The type.
	 */
	set productOptionType(productOptionType: ProductOptionType)
	{
		if(!(JsTypes.isUnspecified(this._productOptionType)))
			throw new InvalidOperationError(PATH, "ProductOptionChoice.set productOptionType()", "Can not change productOptionType after it has been set.");
		if(!(productOptionType instanceof ProductOptionType))
			throw new VariableTypeError(PATH, "ProductOptionChoice.set productOptionType()", productOptionType, "ProductOptionType");
		this._productOptionType = productOptionType.clone();
	}

	/**
	 * Set productOptionVariant.
	 * @param {ProductOptionVariant} productOptionVariant One of the productOptionVariants that belong to this productOption.
	 */
	set productOptionVariant(productOptionVariant: ProductOptionVariant)
	{
		if(!(productOptionVariant instanceof ProductOptionVariant))
			throw new VariableTypeError(PATH, "ProductOptionChoice.set productOptionVariant()", productOptionVariant, "ProductOptionVariant");
		if(productOptionVariant.productOptionTypeId !== this._productOptionType.id)
			throw new VariableValueError(PATH, "ProductOptionChoice.set productOptionVariant()", productOptionVariant, "ProductOptionVariant has to have same productOptionTypeId as the productOptionType");
		this._productOptionVariant = productOptionVariant.clone();
	}
}

export default ProductOptionChoice;