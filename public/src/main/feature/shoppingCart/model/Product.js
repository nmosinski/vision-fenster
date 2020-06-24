const PATH = "public/src/main/feature/shoppingCart/model/Product.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import List from "public/src/main/common/util/list/List.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a product.
 */
class Product extends AbstractEntity
{
	/**
	 * Create a Product.
	 * @param {string} [id] The id of this product.
	 * @param {number} [price] The price of this product.
	 * @param {string} [image] The link to an image represeenting this product.
	 * @param {List<ProductOption>} productOptions - The products options.
	 */
	constructor(id, price, image, productOptions=null)
	{
		super(id);
		this.price = price;
		this.image = image;

		if(!JsTypes.isUnspecified(productOptions))
			this.productOptions = productOptions;
	}

	/**
	 * Get productOptions.
	 * @return {List<ProductOption>} The products options.
	 */
	get productOptions()
	{
		return this._productOptions.clone();
	}

	/**
	 * Get price.
	 * @return {number} The price of this product.
	 */
	get price()
	{
		return this._price;
	}

	/**
	 * Get image.
	 * @return {string} The link to the image representing this product.
	 */
	get image()
	{
		return this._image;
	}

	/**
	 * Set productOptions.
	 * @param {List<ProductOption>} productOptions - The products options.
	 */
	set productOptions(productOptions)
	{
		if(!(productOptions instanceof List))
			throw new VariableTypeError(PATH, "Product. set productOptions()", productOptions, "List<ProductOption>");
		
		this._productOptions = productOptions;
	}

	/**
	 * Set price.
	 * @param {number} [price] The price.
	 */
	set price(price)
	{
		if(!JsTypes.isNumber(price))
			throw new VariableTypeError(PATH, "Product. set price()", price, "number");
		if(price < 0)
			throw new VariableValueError(PATH, "Product.set price()", price, "price > -1");
		this._price = price;
	}

	/**
	 * Set image.
	 * @param {string} [image] The image.
	 */
	set image(image)
	{
		if(!JsTypes.isString(image))
			throw new VariableTypeError(PATH, "Product.set image()", image, "string");
		if(JsTypes.isEmpty(image))
			throw new VariableValueError(PATH, "Product.set image()", image, "Not empty string");
		this._image = image;
	}
}

export default Product;