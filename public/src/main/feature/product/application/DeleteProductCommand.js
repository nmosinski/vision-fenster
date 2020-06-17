const PATH = "public/src/main/feature/product/application/DeleteProductCommand.js";

/**
 * @class
 * Class representing a command for deleting a product used by the ProductApplicationService.
 */
class DeleteProductCommand
{
	/**
	 * Create a DeleteProductCommand.
	 * @param {string} id - The id of the product to be deleted.
	 */
	constructor(id)
	{
		this.id = id;
	}

	/**
	 * Create a DeleteProductCommand from a product model.
	 * @param {Product} product - The product model.
	 * @return {DeleteProductCommand} A DeleteProductCommand.
	 */
	static fromProduct(product)
	{
		return new DeleteProductCommand(product.id);
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
	 * Get the id of the product to be deleted.
	 * @return {string} The id.
	 */
	get id()
	{
		return this._id;
	}
}

export default DeleteProductCommand;
