const PATH = "public/src/main/feature/product/application/UpdateProductCommand.js";

import List from "public/src/main/common/util/list/List.js"

/**
 * @class
 * Class representing a command for updating a product used by the ProductApplicationService.
 */
class UpdateProductCommand
{
	/**
	 * Create an UpdateProductCommand.
	 * @param {string} id - The id of the product to be udpated.
	 * @param {string} [productModelId] - The id of the product model.
	 * @param {number} [price] - The price of the product.
	 * @param {string} [image] - The image of the product.
	 * @param {List<string>} [productOptionVariantIds] The ids of the product option variants this product has.
	 */
	constructor(id, productModelId, price, image, productOptionVariantIds)
	{
		this.id = id;
		this.productModelId = productModelId;
		this.price = price;
		this.image = image;
		this.productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Create an UpdateProductCommand from a product model.
	 * @param {Product} product - The product model.
	 * @return {UpdateProductCommand} An UpdateProductCommand.
	 */
	static fromProduct(product)
	{
		let variantIds = new List();
		product.productOptionChoices.values().foreach(choice => {variantIds.add(choice.productOptionVariant.id);});
		return new UpdateProductCommand(product.id, product.productModelId, product.price, product.image, variantIds);
	}

	/**
	 * Set the id of the product to be updated.
	 * @param {string} id - The id.
	 */
	set id(id)
	{
		this._id = id;
	}

	/**
	 * Set productModelId.
	 * @param {string} productModelId - The id of the product model of this product.
	 */
	set productModelId(productModelId)
	{
		this._productModelId = productModelId;
	}

	/**
	 * Set the price of the product to be updated.
	 * @param {number} price - The price.
	 */
	set price(price)
	{
		this._price = price;
	}

	/**
	 * Set the image source of the product to be updated.
	 * @param {string} image - The source of the image.
	 */
	set image(image)
	{
		this._image = image;
	}

	/**
	 * Set the productOptionVariantIds of the product to be updated.
	 * @param {List} productOptionVariantIds - A list containing the productOptionVariantIds.
	 */
	set productOptionVariantIds(productOptionVariantIds)
	{
		this._productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Get the id of the product to be deleted.
	 * @return {string} The id.
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Get the id of the product model of the product to be updated.
	 * @return {string} The id.
	 */
	get productModelId()
	{
		return this._productModelId;
	}

	/**
	 * Get the price of the product to be updated.
	 * @return {number} The price.
	 */
	get price()
	{
		return this._price;
	}

	/**
	 * Get the image source of the product to be updated.
	 * @return {string} The image source.
	 */
	get image()
	{
		return this._image;
	}

	/**
	 * Get the productOptionVariantIds of the product to be updated.
	 * @return {List} The productOptionVariantIds.
	 */
	get productOptionVariantIds()
	{
		return this._productOptionVariantIds;
	}
}

export default UpdateProductCommand;