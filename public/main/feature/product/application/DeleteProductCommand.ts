const PATH = "public/src/main/feature/product/application/DeleteProductCommand.js";

import Product from "public/src/main/feature/product/model/Product.js"

/**
 * @class
 * Class representing a command for deleting a product used by the ProductApplicationService.
 */
class DeleteProductCommand
{
	private _id: string;
	/**
	 * Create a DeleteProductCommand.
	 * @param {string} id - The id of the product to be deleted.
	 */
	constructor(id: string)
	{
		this.id = id;
	}

	/**
	 * Create a DeleteProductCommand from a product model.
	 * @param {Product} product - The product model.
	 * @return {DeleteProductCommand} A DeleteProductCommand.
	 */
	static fromProduct(product: Product): DeleteProductCommand
	{
		return new DeleteProductCommand(product.id);
	}

	/**
	 * Set the id of the product to be updated.
	 * @param {string} id - The id.
	 */
	set id(id: string)
	{
		this._id = id;
	}

	/**
	 * Get the id of the product to be deleted.
	 * @return {string} The id.
	 */
	get id(): string
	{
		return this._id;
	}
}

export default DeleteProductCommand;
