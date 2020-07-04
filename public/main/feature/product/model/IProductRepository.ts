import Product from "public/main/feature/product/model/Product.js"
import List from "../../../common/util/collections/list/List.js"

interface IProductRepository 
{

	/**
	 * Get the next identity for this entity.
	 * @return {string} The next idendity.
	 */
	nextIdentity(): string;

	/**
	 * Get Product.
	 * @param  {string} productId - The id of Product.
	 * @return {Promise<Product>} The Product.
	 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
	 */
	getProduct(productId): Promise<Product>;

	/**
	 * Get all Products with the given product model id.
	 * @param  {string} productModelId - The product model id.
	 * @return {Promise<List<Product>>} A list with the requested Products.
	 * @throws {EntityNotFoundError} If no entity matching the request exists.
	 */
	getProductsByProductModelId(productModelId): Promise<List<Product>>;

	/**
	 * Save Product.
	 * @param  {Product} product - The Product.
	 */
	saveProduct(product): Promise<void>;

	/**
	 * Update Product.
	 * @param  {Product} product - The Product.
	 */
	updateProduct(product): Promise<void>;

	/**
	 * Delete Product.
	 * @param  {string} productId - The id of the Product.
	 */
	deleteProduct(productId): Promise<void>;
}

export default IProductRepository;