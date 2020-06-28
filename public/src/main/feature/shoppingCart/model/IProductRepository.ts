import Product from "public/src/main/feature/shoppingCart/model/Product";

interface IProductRepository
{
	/**
	 * Get Product.
	 * @param  {string} productId - The id of Product.
	 * @return {Promise<Product>} The Product.
	 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
	 */
	getProduct(productId: string): Promise<Product>;
}

export default IProductRepository;