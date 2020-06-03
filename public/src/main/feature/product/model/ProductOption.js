const PATH = "public/src/main/feature/product/model/ProductOption.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

/**
 * Class representing a ProductOption.
 * @extends AbstractEntity
 */
class ProductOption extends AbstractEntity
{
	/**
	 * Create a ProductOption.
	 * @param {string} id - The id of this entity.
	 * @param {string} productModelId - The id of the productModel.
	 * @param {String} type - The type of ProductOption.
	 * @param {array} variants - Variants that belong to this ProductOption.
	 */
	constructor(id, productModelId, type, variants)
	{
		super(id);
		this.productModelId = productModelId;
		this.type = type;
		this.variants = variants;
	}

	/**
	 * Get the productModelId.
	 * @return {string} the productModelId.
	 * @abstract
	 * @todo Implement this function.
	 */
	get productModelId()
	{
		return this._productModelId;
	}

	get type()
	{
		return this._type;
	}

	get variants()
	{
		return this._variants;
	}

	set productModelId(id)
	{
		this._productModelId = id;
	}

	set type(type)
	{
		this._type = type;
	}

	set variants(variants)
	{
		this._variants = variants;
	}
}

export default ProductOption