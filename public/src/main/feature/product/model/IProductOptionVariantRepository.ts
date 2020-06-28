import ProductOptionVariant from "public/src/main/feature/product/model/ProductOptionVariant.js"
import List from "public/src/main/common/util/list/List.js"

interface IProductOptionVariantRepository
{
	/**
	 * Get ProductOptionVariant.
	 * @param  {string} ProductOptionVariantId - The id of ProductOptionVariant.
	 * @return {Promise<ProductOptionVariant>} The ProductOptionVariant.
	 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
	 */
	getProductOptionVariant(productOptionVariantId): Promise<ProductOptionVariant>;

	/**
	 * Get all ProductOptionVariants with the given product option type id.
	 * @param  {string} productOptionTypeId - The product option type id.
	 * @return {Promise<List<ProductOptionVariant>>} A list with the requested ProductOptionVariants.
	 * @throws {EntityNotFoundError} If no entity matching the request exists.
	 */
	getProductOptionVariantsByProductOptionTypeId(productOptionTypeId): Promise<List<ProductOptionVariant>>;

	/**
	 * Get many ProductOptionVariants with the given product option variant ids.
	 * @param  {List<string>} productOptionVariantIds - The product option variant ids.
	 * @return {Promise<List<ProductOptionVariant>>} A list with the requested ProductOptionVariants.
	 * @throws {EntityNotFoundError} If no entity matching the request exists.
	 */
	getManyProductOptionVariants(productOptionVariantIds): Promise<List<ProductOptionVariant>>;

	/**
	 * Save ProductOptionVariant.
	 * @param  {ProductOptionVariant} productOptionVariant - The ProductOptionVariant.
	 */
	saveProductOptionVariant(productOptionVariant): Promise<void>;

	/**
	 * Update ProductOptionVariant.
	 * @param  {ProductOptionVariant} productOptionVariant - The ProductOptionVariant.
	 */
	updateProductOptionVariant(productOptionVariant): Promise<void>;

	/**
	 * Delete ProductOptionVariant.
	 * @param  {string} productOptionVariantId - The id of the ProductOptionVariant.
	 */
	deleteProductOptionVariant(productOptionVariantId): Promise<void>;
}

export default IProductOptionVariantRepository;