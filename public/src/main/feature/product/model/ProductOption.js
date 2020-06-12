const PATH = "public/src/main/feature/product/model/ProductOption.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"
import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js"
import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an option of a product.
 */
class ProductOption extends IComparable()
{
	/**
	 * Create ProductOption.
	 * @param {ProductOptionType} [type] The type of this product option.
	 * @param {List<ProductOptionVariant>} [variants] The variants of this product option.
	 */
	constructor(type, variants)
	{
		super();
		this.type = type;
		this.variants = new KVMap();

		if(!(variants instanceof List))
			throw new VariableTypeError(PATH, "ProductOption.constructor()", variants, "List<ProductOptionVariant>");
		
		variants.foreach(variant => {this.addVariant(variant)});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof ProductOption))
			return false;
		if(!this.type.equals(o.type))
			return false;
		if(!this.variant.equals(o.variant))
			return false;
		return true;
	}

	/**
	 * Add a possible product option variant.
	 * @param {ProductOptionVariant} [variant] The variant to be added.
	 */
	addVariant(variant)
	{
		if(!(variant instanceof ProductOptionVariant))
			throw new VariableTypeError(PATH, "ProductOption.addVariant()", variant, "ProductOptionVariant");
		this.variants.add(variant.id, variant);
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
		return this.variants.get(variantId);
	}

	/**
	 * Get all product option variants.
	 * @return {List<ProductOptionVariant>} The variants.
	 */
	getAllVariants()
	{
		return this.variants.values();
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
		this.variants.delete(variantId);
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof ProductOption))
			return false;
		if(!this.type === o.type)
			return false;
		if(!this.variants === o.variants)
			return false;
		return true;
	}

	/**
	 * Get type.
	 * @return {ProductOptionType} The type.
	 */
	get type()
	{
		return this._type;
	}

	/**
	 * Get variants.
	 * @return {KVMap<ProductOptionVariant>} The variants.
	 */
	get variants()
	{
		return this._variants;
	}

	/**
	 * Set type.
	 * @param {ProductOptionType} [type] The type.
	 */
	set type(type)
	{
		if(!(type instanceof ProductOptionType))
			throw new VariableTypeError(PATH, "ProductOption.set type()", type, "ProductOptionType");
		this._type = type;
	}

	/**
	 * Set variants.
	 * @param {KVMap<ProductOptionVariant>} [variants] The variants that belong to this productOption.
	 */
	set variants(variants)
	{
		if(!(variants instanceof KVMap))
			throw new VariableTypeError(PATH, "ProductOption.set variants()", variants, "KVMap");
		this._variants = variants;
	}
}

export default ProductOption