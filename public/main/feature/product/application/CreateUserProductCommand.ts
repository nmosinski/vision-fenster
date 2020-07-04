const PATH = "public/src/main/feature/product/application/CreateUserProductCommand.js";

import Product from "public/src/main/feature/product/model/Product.js"

import List from "../../../common/util/collections/list/List.js"
import ProductOptionChoice from "../model/ProductOptionChoice";

/**
 * @class
 * Class representing a command for creating a new product used by the ProductApplicationService.
 */
class CreateUserProductCommand
{
	private _productModelId: string;
	private _image: string;
	private _price: number;
	private _productOptionVariantIds: List<string>;
	/**
	 * Create a CreateUserProductCommand.
	 * @param {string} productModelId - The id of the product model.
	 * @param {number} price - The price of the product.
	 * @param {string} image - The image of the product.
	 * @param {List<string>} [productOptionVariantIds=null] The ids of the product option variants this product has.
	 */
	constructor(productModelId: string, price: number, image: string, productOptionVariantIds: List<string>=null)
	{
		this.productModelId = productModelId;
		this.price = price;
		this.image = image;
		this.productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Create a CreateProductCommand from a product model.
	 * @param {Product} product - The product model.
	 * @return {CreateUserProductCommand} A CreateProductCommand.
	 */
	static fromProduct(product: Product): CreateUserProductCommand
	{
		let variantIds = new List<string>();
		product.productOptionChoices.values().foreach((choice: ProductOptionChoice) => {variantIds.add(choice.productOptionVariant.id);});
		return new CreateUserProductCommand(product.productModelId, product.price, product.image, variantIds);
	}

	/**
	 * Set productModelId.
	 * @param {string} productModelId - The id of the product model of this product.
	 */
	set productModelId(productModelId: string)
	{
		this._productModelId = productModelId;
	}

	/**
	 * Set the price of the product to be created.
	 * @param {number} price - The price.
	 */
	set price(price: number)
	{
		this._price = price;
	}

	/**
	 * Set the image source of the product to be created.
	 * @param {string} image - The source of the image.
	 */
	set image(image: string)
	{
		this._image = image;
	}

	/**
	 * Set the productOptionVariantIds of the product to be created.
	 * @param {List<string>} productOptionVariantIds - A list containing the productOptionVariantIds.
	 */
	set productOptionVariantIds(productOptionVariantIds: List<string>)
	{
		this._productOptionVariantIds = productOptionVariantIds;
	}

	/**
	 * Get the id of the product model of the product to be created.
	 * @return {string} The id.
	 */
	get productModelId(): string
	{
		return this._productModelId;
	}

	/**
	 * Get the price of the product to be created.
	 * @return {number} The price.
	 */
	get price(): number
	{
		return this._price;
	}

	/**
	 * Get the image source of the product to be created.
	 * @return {string} The image source.
	 */
	get image(): string
	{
		return this._image;
	}

	/**
	 * Get the productOptionVariantIds of the product to be created.
	 * @return {List<string>} The productOptionVariantIds.
	 */
	get productOptionVariantIds(): List<string>
	{
		return this._productOptionVariantIds;
	}
}

export default CreateUserProductCommand;