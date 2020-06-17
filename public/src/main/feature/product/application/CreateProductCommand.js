const PATH = "public/src/main/feature/product/application/CreateProductCommand.js";

import List from "public/src/main/common/util/list/List.js"

/**
 * @class
 * Class representing a command for creating a new product used by the ProductApplicationService.
 */
class CreateProductCommand
{
	/**
	 * Create a CreateProductCommand.
	 * @param {string} [productModelId] - The id of the product model.
	 * @param {number} [price] - The price of the product.
	 * @param {string} [image] - The image of the product.
	 * @param {List<string>} [productOptionVariantIds] The ids of the product option variants this product has.
	 */
	constructor(productModelId, price, image, productOptionVariantIds)
	{
		this.productModelId = productModelId;
		this.price = price;
		this.image = image;
		this.productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Create a CreateProductCommand from a product model.
	 * @param {Product} product - The product model.
	 * @return {CreateProductCommand} A CreateProductCommand.
	 */
	static fromProduct(product)
	{
		let variantIds = new List();
		product.productOptionChoices.values().foreach(choice => {variantIds.add(choice.productOptionVariant.id);});
		return new CreateProductCommand(product.productModelId, product.price, product.image, variantIds);
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
	 * Set the price of the product to be created.
	 * @param {number} price - The price.
	 */
	set price(price)
	{
		this._price = price;
	}

	/**
	 * Set the image source of the product to be created.
	 * @param {string} image - The source of the image.
	 */
	set image(image)
	{
		this._image = image;
	}

	/**
	 * Set the productOptionVariantIds of the product to be created.
	 * @param {List} productOptionVariantIds - A list containing the productOptionVariantIds.
	 */
	set productOptionVariantIds(productOptionVariantIds)
	{
		this._productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Get the id of the product model of the product to be created.
	 * @return {string} The id.
	 */
	get productModelId()
	{
		return this._productModelId;
	}

	/**
	 * Get the price of the product to be created.
	 * @return {number} The price.
	 */
	get price()
	{
		return this._price;
	}

	/**
	 * Get the image source of the product to be created.
	 * @return {string} The image source.
	 */
	get image()
	{
		return this._image;
	}

	/**
	 * Get the productOptionVariantIds of the product to be created.
	 * @return {List} The productOptionVariantIds.
	 */
	get productOptionVariantIds()
	{
		return this._productOptionVariantIds;
	}
}

export default CreateProductCommand;