const PATH = "public/src/main/feature/product/model/ProductModel.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a product model.
 */
class ProductModel extends AbstractEntity
{
	/**
	 * Create a product model.
	 * @param {string} id - The id of the product model.
	 * @param {string} productTypeId - The id of the product type.
	 * @param {string} productCategoryId - The id of the product category.
	 */
	constructor(id, productTypeId, productCategoryId)
	{
		super(id);
		this.productTypeId = productTypeId;
		this.productCategoryId = productCategoryId;
	}

	/**
	 * Set the productTypeId.
	 * @param {string} productTypeId - The productTypeId.
	 */
	set productTypeId(productTypeId)
	{
		if(!JsTypes.isString(productTypeId))
			throw new VariableTypeError(PATH, "ProductModel.set productTypeId()", productTypeId, "string");
		if(JsTypes.isEmpty(productTypeId))
			throw new VariableValueError(PATH, "ProductModel.set productTypeId()", productTypeId, "not empty");

		this._productTypeId = productTypeId;
	}

	/**
	 * Set the productCategoryId.
	 * @param {string} productCategoryId - The productCategoryId.
	 */
	set productCategoryId(productCategoryId)
	{
		if(!JsTypes.isString(productCategoryId))
			throw new VariableTypeError(PATH, "ProductModel.set productCategoryId()", productCategoryId, "string");
		if(JsTypes.isEmpty(productCategoryId))
			throw new VariableValueError(PATH, "ProductModel.set productCategoryId()", productCategoryId, "not empty");

		this._productCategoryId = productCategoryId;
	}

	/**
	 * Get the productTypeId.
	 * @return {string} The productTypeId.
	 */
	get productTypeId()
	{
		return this._productTypeId;
	}

	/**
	 * Get the productCategoryId.
	 * @return {string} The productCategoryId.
	 */
	get productCategoryId()
	{
		return this._productCategoryId;
	}
}

export default ProductModel;