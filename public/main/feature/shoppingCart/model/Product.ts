const PATH = "public/main/feature/shoppingCart/model/Product.js";

import AbstractModel from "public/main/common/AbstractModel.js"
import List from "../../../common/util/collections/list/List.js"
import ProductOption from "public/main/feature/shoppingCart/model/ProductOption.js"
import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a product.
 */
class Product extends AbstractModel
{
	private _type: string;
	private _price: number;
	private _image: string;
	private _productOptions: List<ProductOption>;
	/**
	 * Create a Product.
	 * @param {string} id The id of this product.
	 * @param {string} type The type of this product.
	 * @param {number} price The price of this product.
	 * @param {string} image The link to an image represeenting this product.
	 * @param {List<ProductOption>} productOptions - The products options.
	 */
	constructor(id: string, type: string, price: number, image: string, productOptions: List<ProductOption>=null)
	{
		super(id);
		this.type = type;
		this.price = price;
		this.image = image;

		if(!JsTypes.isUnspecified(productOptions))
			this.productOptions = productOptions;
	}

	/**
	 * Get productOptions.
	 * @return {List<ProductOption>} The products options.
	 */
	get productOptions(): List<ProductOption>
	{
		return this._productOptions;
	}

	/**
	 * Get type.
	 * @returns {string} the type of this Product.
	 */
	get type(): string
	{
		return this._type;
	}

	/**
	 * Get price.
	 * @return {number} The price of this product.
	 */
	get price(): number
	{
		return this._price;
	}

	/**
	 * Get image.
	 * @return {string} The link to the image representing this product.
	 */
	get image(): string
	{
		return this._image;
	}

	/**
	 * Set productOptions.
	 * @param {List<ProductOption>} productOptions - The products options.
	 */
	set productOptions(productOptions: List<ProductOption>)
	{
		if(!(productOptions instanceof List))
			throw new VariableTypeError(PATH, "Product. set productOptions()", productOptions, "List<ProductOption>");
		
		this._productOptions = productOptions;
	}

	/**
	 * Set price.
	 * @param {number} price The price.
	 */
	set price(price: number)
	{
		if(!JsTypes.isNumber(price))
			throw new VariableTypeError(PATH, "Product. set price()", price, "number");
		if(price < 0)
			throw new VariableValueError(PATH, "Product.set price()", price, "price > -1");
		this._price = price;
	}

	set type(type)
	{
		this._type = type;
	}

	/**
	 * Set image.
	 * @param {string} image The image.
	 */
	set image(image: string)
	{
		if(!JsTypes.isString(image))
			throw new VariableTypeError(PATH, "Product.set image()", image, "string");
		if(JsTypes.isEmpty(image))
			throw new VariableValueError(PATH, "Product.set image()", image, "Not empty string");
		this._image = image;
	}
}

export default Product;