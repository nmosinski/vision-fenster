const PATH = "public/src/main/feature/product/model/Product.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"
import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import ProductOptionChoice from "public/src/main/feature/product/model/ProductOptionChoice.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"
import InvalidOperationError from "public/src/main/common/util/error/InvalidOperationError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a product.
 */
class Product extends IComparable(IClonable(AbstractEntity))
{
	/**
	 * Create a Product.
	 * @param {string} [id] The id of this product.
	 * @param {string} [productModelId] The id of the product model this product belongs to.
	 * @param {ClonableKVMap<ProductOptionChoice> | empty} [productOptionChoices=null] A map with all productOptionChoices of this product (product) (productOptionTypeId -> productChoice).
	 * @param {number} [price] The price of this product.
	 * @param {string} [image] The link to an image represeenting this product.
	 */
	constructor(id, productModelId, price, image, productOptionChoices=null)
	{
		super(id);
		this.productModelId = productModelId;
		this.price = price;
		this.image = image;

		if(!(productOptionChoices instanceof ClonableKVMap))
		{
			if(!JsTypes.isUnspecified(productOptionChoices))
				throw new VariableTypeError(PATH, "Product.constructor()", productOptionChoices, "ClonableKVMap");
			this.productOptionChoices = new ClonableKVMap();
		}
		else
			this.productOptionChoices = productOptionChoices;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o)
	{
		if(!(o instanceof Product))
			return false;
		if(this._id !== o.id)
			return false;
		if(this._productModelId !== o.produtModelId)
			return false;
		if(this._price !== o.price)
			return false;
		if(this._image !== o.image)
			return false;
		if(this._productOptionChoices !== o.productOptionChoices)
			return false;
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	clone()
	{
		return new Product(this.id, this.productModelId, this.price, this.image, this.productOptionChoices);
	}

	/**
	 * Save a productOptionChoice for this product.
	 * @param {ProductOptionChoice} [productOptionChoice] The product option choice to be saved.
	 */
	saveProductOptionChoice(productOptionChoice)
	{
		if(!(productOptionChoice instanceof ProductOptionChoice))
			throw new VariableTypeError(PATH, "Product.saveProductOptionChoice()", productOptionChoice, "ProductOptionChoice");
		if(productOptionChoice.productOptionType.productModelId !== this._productModelId)
			throw new VariableValueError(PATH, "Product.saveProductOptionChoice()", productOptionChoice, "ProductOptionChoice must be compatible with the given productModelId (" + this._productModelId + ")");

		this._productOptionChoices.add(productOptionChoice.productOptionType.id, productOptionChoice);
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

		this._productOptionChoices.remove(productOptionTypeId);
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

		if(!this._productOptionChoices.has(productOptionChoice))
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

		if(!this._productOptionChoices.hasAny(productOptionTypeId))
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
		return this._productOptionChoices.clone();
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
		if(!JsTypes.isUnspecified(this._productModelId))
			throw new InvalidOperationError(PATH, "Product.set productModelId()", "Can not cange productModelId after it has been set.");
		if(!JsTypes.isString(productModelId))
			throw new VariableTypeError(PATH, "Product.set productModelId()", productModelId, "string");
		if(JsTypes.isEmpty(productModelId))
			throw new VariableValueError(PATH, "Product.set productModelId()", productModelId, "Not empty string");
		
		this._productModelId = productModelId;
	}

	/**
	 * Set productOptionChoices.
	 * @param {ClonableKVMap<ProductOptionChoice>} [productOptionChoices] The product option choices.
	 */
	set productOptionChoices(productOptionChoices)
	{
		if(!(productOptionChoices instanceof ClonableKVMap))
			throw new VariableTypeError(PATH, "Product. set productOptionChoices()", productOptionChoices, "ClonableKVMap<ProductOptionChoice>");
		
		this._productOptionChoices = new ClonableKVMap();
		productOptionChoices.values().foreach(choice => {this.saveProductOptionChoice(choice);});
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