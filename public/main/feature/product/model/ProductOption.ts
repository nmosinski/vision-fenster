const PATH = "public/src/main/feature/product/model/ProductOption.js";

import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"
import KVMap from "../../../common/util/collections/map/KVMap.js"
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
class ProductOption implements IComparable<ProductOption>, IClonable<ProductOption>
{
	private _type: ProductOptionType;
	private _variants: KVMap<string, ProductOptionVariant>;
	/**
	 * Create ProductOption.
	 * @param {ProductOptionType} type The type of this product option.
	 * @param {KVMap<string, ProductOptionVariant>} variants The variants of this product option (variant id => variant).
	 */
	constructor(type: ProductOptionType, variants: KVMap<string, ProductOptionVariant>)
	{
		this.type = type;
		this.variants = variants;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o: ProductOption): boolean
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
	clone(): ProductOption
	{
		return new ProductOption(this.type, this.variants);
	}

	/**
	 * Add a possible product option variant.
	 * @param {ProductOptionVariant} variant The variant to be added.
	 */
	saveVariant(variant: ProductOptionVariant): void
	{
		if(!(variant instanceof ProductOptionVariant))
			throw new VariableTypeError(PATH, "ProductOption.addVariant()", variant, "ProductOptionVariant");
		if(variant.productOptionTypeId !== this._type.id)
			throw new VariableValueError(PATH, "ProductOption.addVariant()", variant, "ProductOptionVariant has to have same productOptionTypeId as the productOptionType");
		
		this._variants.add(variant.id, variant);
	}

	/**
	 * Get a product option variant.
	 * @param {string} variantId The id of the variant.
	 * @return {ProductOptionVariant} The product option variant.
	 */
	getVariant(variantId: string): ProductOptionVariant
	{
		if(!JsTypes.isString(variantId))
			throw new VariableTypeError(PATH, "ProductOption.getVariant()", variantId, "string");
		if(JsTypes.isEmpty(variantId))
			throw new VariableValueError(PATH, "ProductOption.getVariant()", variantId, "string");
		
		return this._variants.get(variantId).clone();
	}

	/**
	 * Delete a product option variant.
	 * @param {string} variantId The id of the variant.
	 */
	deleteVariant(variantId: string): void
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
	get type(): ProductOptionType
	{
		return this._type.clone();
	}

	/**
	 * Get variants.
	 * @return {KVMap<string, ProductOptionVariant>} The variants.
	 */
	get variants(): KVMap<string, ProductOptionVariant>
	{
		return this._variants.copy();
	}

	/**
	 * Set type.
	 * @param {ProductOptionType} type The type.
	 */
	set type(type: ProductOptionType)
	{
		if(!(JsTypes.isUnspecified(this._type)))
			throw new InvalidOperationError(PATH, "ProductOption.set type()", "Can not change type after it has been set.");
		if(!(type instanceof ProductOptionType))
			throw new VariableTypeError(PATH, "ProductOption.set type()", type, "ProductOptionType");
		
		this._type = type.clone();
	}

	/**
	 * Set variants.
	 * @param {KVMap<ProductOptionVariant>} variants The variants that belong to this productOption.
	 */
	set variants(variants: KVMap<string, ProductOptionVariant>)
	{
		if(!(variants instanceof KVMap))
			throw new VariableTypeError(PATH, "ProductOption.set variants()", variants, "KVMap");
		
		this._variants = new KVMap<string, ProductOptionVariant>();
		variants.values().foreach(variant=>{this.saveVariant(variant)});
	}
}

export default ProductOption;