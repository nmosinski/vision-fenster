const PATH = "public/src/main/feature/product/model/Product.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import KVMap from "public/src/main/common/util/map/KVMap.js"
import List from "public/src/main/common/util/list/List.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

class Product extends IComparable(AbstractEntity)
{
	/**
	 * Create a Product.
	 * @param {string} [id] The id of this product.
	 * @param {string} [productModelId] The id of the product model this product belongs to.
	 * @param {List<ProductOptionChoice> | empty} [productOptionChoices=null] A list with all productOptionChoices of this product.
	 * @param {number} [price] The price of this product.
	 * @param {string} [image] The link to an image represeenting this product.
	 */
	constructor(id, productModelId, price, image, productOptionChoices)
	{
		super(id);
		this.productModelId = productModelId;
		this.productOptionChoices = new KVMap();
		this.price = price;
		this.image = image;

		if(!(productOptionChoices instanceof List))
		{
			if(!JsTypes.isEmpty(productOptionChoices))
				throw new VariableTypeError(PATH, "Product.constructor()", productOptionChoices, "List");
		}
		else
			productOptionChoices.foreach(productOptionChoice => {this.saveProductOptionChoice(productOptionChoice)});
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof Product))
			return false;
		if(this.id !== o.id)
			return false;
		if(this.productModelId !== o.produtModelId)
			return false;
		if(this.productOptionChoices !== o.productOptionChoices)
			return false;
		if(this.price !== o.price)
			return false;
		if(this.image !== o.image)
			return false;
		return true;
	}

	/**
	 * Save a productOptionChoice for this product.
	 * @param {ProductOptionChoice} [productOptionChoice] The product option choice to be saved.
	 */
	saveProductOptionChoice(productOptionChoice)
	{
		if(!(productOptionChoice instanceof ProductOptionChoice))
			throw new VariableTypeError(PATH, "Product.saveProductOptionChoice()", productOptionChoice, "ProductOptionChoice");
		this.productOptionChoices.add(productOptionChoice.productOptionType.id, productOptionChoice);
	}

	/**
	 * Delete a productOptionChoice from this product.
	 * @param {string} [productOptionTypeId] The id of the product option type that the product option choice has that has to be deleted.
	 */
	deleteProductOptionChoiceOfProductOptionTypeId(productOptionTypeId)
	{
		if(!JsTypes.isString(productOptionTypeId))
			throw new VariableTypeError(PATH, "Product.deleteProductOptionChoiceOfProductOptionTypeId()", productOptionTypeId, "string");
		if(JsTypes.isEmpty(productOptionTypeId))
			throw new VariableValueError(PATH, "Product.deleteProductOptionChoiceOfProductOptionTypeId()", productOptionTypeId, "string");

		this.productOptionVariants.delete(productOptionTypeId);
	}

	/**
	 * Check if product has a productOptionChoice.
	 * @param {ProductOptionChoice} [productOptionChoice] The product option choice to be checked for.
	 * @return {boolean} True if product has the given productOptionChoice, else false. 
	 */
	hasProductOptionChoice(productOptionChoice)
	{
		if(!(productOptionChoice instanceof ProductOptionChoice))
			throw new VariableTypeError(PATH, "Product.hasProductOptionChoice()", productOptionChoice, "ProductOptionChoice");

		if(!this.productOptionChoices.has(productOptionChoice))
			return false;
		return true;
	}

	/**
	 * Check if product has any productOptionChoice of the given productOptionTypeId.
	 * @param {string} [productOptionTypeId] The id of the productOptionType.
	 * @return {boolean} True if product has any productOptionChoice containing aproductOptionType of the gicen id, else false. 
	 */
	hasAnyProductOptionChoiceOfProductOptionTypeId(productOptionTypeId)
	{
		if(!JsTypes.isString(productOptionTypeId))
			throw new VariableTypeError(PATH, "Product.hasAnyProductOptionChoiceOfProductOptionTypeId()", productOptionTypeId, "string");
		if(JsTypes.isEmpty(productOptionTypeId))
			throw new VariableValueError(PATH, "Product.hasAnyProductOptionChoiceOfProductOptionTypeId()", productOptionTypeId, "string");

		if(!this.productOptionChoices.hasAny(productOptionTypeId))
			return false;
		return true;
	}

	/**
	 * Get productModelId.
	 * @return {string} The id of the product model that this product belongs to.
	 */
	get productModelId()
	{
		return this._productModelId;
	}

	/**
	 * Get productOptionChoices.
	 * @return {KVMap<ProductOptionChoice>} The product option choices of this product.
	 */
	get productOptionChoices()
	{
		return this._productOptionChoices;
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
	 * Set productModelId.
	 * @param {string} [productModelId] The id of the product model of this product.
	 */
	set productModelId(productModelId)
	{
		this._productModelId = productModelId;
	}

	/**
	 * Set productOptionChoices.
	 * @param {KVMap<ProductOptionChoice>} [productOptionChoices] The product option choices.
	 */
	set productOptionChoices(productOptionChoices)
	{
		if(!(productOptionChoices instanceof KVMap))
			throw new VariableTypeError(PATH, "Product. set productOptionChoices()", productOptionChoices, "KVMap<ProductOptionChoice>");
		this._productOptionChoices = productOptionChoices;
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

export default Product