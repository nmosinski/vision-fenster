const PATH = "public/src/main/feature/product/model/ProductOption.js";

import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"
import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js"
import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"

import InvalidOperationError from "public/src/main/common/util/error/InvalidOperationError.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an option of a product.
 */
class ProductOption extends IComparable(IClonable())
{
	/**
	 * Create ProductOption.
	 * @param {ProductOptionType} [type] The type of this product option.
	 * @param {ClonableKVMap<ProductOptionVariant>} [variants] The variants of this product option (variant id => variant).
	 */
	constructor(type, variants)
	{
		super();

		this.type = type;
		this.variants = variants;

	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof ProductOption))
			return false;
		if(!this._type.equals(o.type))
			return false;
		if(!this._variants.equals(o.variants))
			return false;
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	clone()
	{
		return new ProductOption(this.type, this.variants);
	}

	/**
	 * Add a possible product option variant.
	 * @param {ProductOptionVariant} [variant] The variant to be added.
	 */
	saveVariant(variant)
	{
		if(!(variant instanceof ProductOptionVariant))
			throw new VariableTypeError(PATH, "ProductOption.addVariant()", variant, "ProductOptionVariant");
		if(variant.productOptionTypeId !== this._type.id)
			throw new VariableValueError(PATH, "ProductOption.addVariant()", variant, "ProductOptionVariant has to have same productOptionTypeId as the productOptionType");
		
		this._variants.add(variant.id, variant);
	}

	/**
	 * Get a product option variant.
	 * @param {string} [variantId] The id of the variant.
	 * @return {ProductOptionVariant} The product option variant.
	 */
	getVariant(variantId)
	{
		if(!JsTypes.isString(variantId))
			throw new VariableTypeError(PATH, "ProductOption.getVariant()", variantId, "string");
		if(JsTypes.isEmpty(variantId))
			throw new VariableValueError(PATH, "ProductOption.getVariant()", variantId, "string");
		
		return this._variants.get(variantId).clone();
	}

	/**
	 * Delete a product option variant.
	 * @param {string} [variantId] The id of the variant.
	 */
	deleteVariant(variantId)
	{
		if(!JsTypes.isString(variantId))
			throw new VariableTypeError(PATH, "ProductOption.deleteVariant()", variantId, "string");
		if(JsTypes.isEmpty(variantId))
			throw new VariableValueError(PATH, "ProductOption.deleteVariant()", variantId, "string");
		
		this._variants.remove(variantId);
	}

	/**
	 * Get type.
	 * @return {ProductOptionType} The type.
	 */
	get type()
	{
		return this._type.clone();
	}

	/**
	 * Get variants.
	 * @return {KVMap<ProductOptionVariant>} The variants.
	 */
	get variants()
	{
		return this._variants.clone();
	}

	/**
	 * Set type.
	 * @param {ProductOptionType} [type] The type.
	 */
	set type(type)
	{
		if(!(JsTypes.isUnspecified(this._type)))
			throw new InvalidOperationError(PATH, "ProductOption.set type()", "Can not change type after it has been set.");
		if(!(type instanceof ProductOptionType))
			throw new VariableTypeError(PATH, "ProductOption.set type()", type, "ProductOptionType");
		
		this._type = type.clone();
	}

	/**
	 * Set variants.
	 * @param {ClonableKVMap<ProductOptionVariant>} [variants] The variants that belong to this productOption.
	 */
	set variants(variants)
	{
		if(!(variants instanceof ClonableKVMap))
			throw new VariableTypeError(PATH, "ProductOption.set variants()", variants, "ClonableKVMap");
		
		this._variants = new ClonableKVMap();
		variants.values().foreach(variant=>{this.saveVariant(variant)});
	}
}

export default ProductOption;