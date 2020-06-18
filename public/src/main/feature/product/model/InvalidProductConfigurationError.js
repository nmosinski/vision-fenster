const PATH = "public/src/main/feature/product/model/InvalidProductConfigurationError.js";

import AbstractCheckedError from "public/src/main/common/util/error/AbstractCheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an error when an invalid product configuration operation has been requested.
 */
class InvalidProductConfigurationError extends AbstractCheckedError
{
	/**
	 * Create an InvalidProductConfigurationError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {ProductOptionChoice} productOptionChoice - The ProductOptionChoice that was intented to be set.
	 * @param {Product} product - The Product on which the ProductOptionChoice was intented to be set.
	 */
	constructor(file, location, productOptionChoice, product)
	{
		super("The product can not be configured with the given productOptionChoice", file, location);
		this.productOptionChoice = productOptionChoice;
		this.product = product;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString()
	{
		let ret = super.toString();
		ret += "\nProductOptionChoice: " + this.productOptionChoice.toString();
		return ret + "\nProduct: " + this.product.toString();
	}

	/**
	 * Get the productOptionChoice.
	 * @return {ProductOptionChoice} The productOptionChoice.
	 */
	get productOptionChoice()
	{
		return this._productOptionChoice;
	}

	/**
	 * Get the product.
	 * @return {Product} The product.
	 */
	get product()
	{
		return this._product;
	}

	/**
	 * Set the productOptionChoice.
	 * @param {ProductOptionChoice} productOptionChoice - The productOptionChoice.
	 */
	set productOptionChoice(productOptionChoice)
	{
		if(!JsTypes.isUnspecified(productOptionChoice))
			this._productOptionChoice = productOptionChoice;
		else
			this._productOptionChoice = "";
	}

	/**
	 * Set the product.
	 * @param {Product} product - The product.
	 */
	set product(product)
	{
		if(!JsTypes.isUnspecified(product))
			this._product = product;
		else
			this._product = "";
	}
}

export default InvalidProductConfigurationError;