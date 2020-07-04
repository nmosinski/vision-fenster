const PATH = "public/main/feature/product/model/ProductModel.js";

import AbstractModel from "public/main/common/AbstractModel.js"

import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a product model.
 */
class ProductModel extends AbstractModel
{
	private _productTypeId: string;
	private _productCategoryId: string;
	/**
	 * Create a product model.
	 * @param {string} id - The id of the product model.
	 * @param {string} productTypeId - The id of the product type.
	 * @param {string} productCategoryId - The id of the product category.
	 */
	constructor(id: string, productTypeId: string, productCategoryId: string)
	{
		super(id);
		this.productTypeId = productTypeId;
		this.productCategoryId = productCategoryId;
	}

	/**
	 * Set the productTypeId.
	 * @param {string} productTypeId - The productTypeId.
	 */
	set productTypeId(productTypeId: string)
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
	set productCategoryId(productCategoryId: string)
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
	get productTypeId(): string
	{
		return this._productTypeId;
	}

	/**
	 * Get the productCategoryId.
	 * @return {string} The productCategoryId.
	 */
	get productCategoryId(): string
	{
		return this._productCategoryId;
	}
}

export default ProductModel;