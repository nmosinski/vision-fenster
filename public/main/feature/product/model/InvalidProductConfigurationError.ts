const PATH = "public/src/main/feature/product/model/InvalidProductConfigurationError.js";

import AbstractCheckedError from "public/src/main/common/util/error/AbstractCheckedError.js"

import Product from "public/src/main/feature/product/model/Product.js"

import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an error when an invalid product configuration operation has been requested.
 */
class InvalidProductConfigurationError extends AbstractCheckedError
{
	private _product: Product;
	private _productOptionChoice: ProductOptionChoice;
	/**
	 * Create an InvalidProductConfigurationError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {ProductOptionChoice} productOptionChoice - The ProductOptionChoice that was intented to be set.
	 * @param {Product} product - The Product on which the ProductOptionChoice was intented to be set.
	 */
	constructor(file: string, location: string, productOptionChoice: ProductOptionChoice, product: Product)
	{
		super("The product can not be configured with the given productOptionChoice", file, location);
		this.productOptionChoice = productOptionChoice;
		this.product = product;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString(): string
	{
		let ret = super.toString();
		if(!JsTypes.isUnspecified(this.productOptionChoice))
			ret += "\nProductOptionChoice: " + this.productOptionChoice.toString();
		if(!JsTypes.isUnspecified(this.product))
			ret + "\nProduct: " + this.product.toString();
		return ret;
	}

	/**
	 * Get the productOptionChoice.
	 * @return {ProductOptionChoice} The productOptionChoice.
	 */
	get productOptionChoice(): ProductOptionChoice
	{
		return this._productOptionChoice;
	}

	/**
	 * Get the product.
	 * @return {Product} The product.
	 */
	get product(): Product
	{
		return this._product;
	}

	/**
	 * Set the productOptionChoice.
	 * @param {ProductOptionChoice} productOptionChoice - The productOptionChoice.
	 */
	set productOptionChoice(productOptionChoice: ProductOptionChoice)
	{
		this._productOptionChoice = productOptionChoice;
	}

	/**
	 * Set the product.
	 * @param {Product} product - The product.
	 */
	set product(product: Product)
	{
		this._product = product;
	}
}

export default InvalidProductConfigurationError;