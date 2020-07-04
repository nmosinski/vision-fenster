import ProductOptionType from "public/src/main/feature/product/model/ProductOptionType.js"
import List from "../../../common/util/collections/list/List.js"

interface IProductOptionTypeRepository
{
	/**
	 * Get ProductOptionType.
	 * @param  {string} productOptionTypeId - The id of ProductOptionType.
	 * @return {Promise<ProductOptionType>} The ProductOptionType.
	 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
	 */
	getProductOptionType(productOptionTypeId): Promise<ProductOptionType>;

	/**
	 * Get many ProductOptionTypes with the given product option Type ids.
	 * @param  {List<string>} productOptionTypeIds - The product option type ids.
	 * @return {Promise<List<ProductOptionType>>} A list with the requested ProductOptionTypes.
	 * @throws {EntityNotFoundError} If no entity matching the request exists.
	 */
	getManyProductOptionTypes(productOptionTypeIds): Promise<List<ProductOptionType>>;

	/**
	 * Get all ProductOptionTypes with the given product model id.
	 * @param  {string} productModelId - The product model id.
	 * @return {Promise<List<ProductOptionType>>} A list with the requested ProductOptionTypes.
	 * @throws {EntityNotFoundError} If no entity matching the request exists.
	 */
	getProductOptionTypesByProductModelId(productModelId): Promise<List<ProductOptionType>>;

	/**
	 * Save ProductOptionType.
	 * @param  {ProductOptionType} productOptionType - The ProductOptionType.
	 */
	saveProductOptionType(productOptionType): Promise<void>;

	/**
	 * Update ProductOptionType.
	 * @param  {ProductOptionType} productOptionType - The ProductOptionType.
	 */
	updateProductOptionType(productOptionType): Promise<void>;

	/**
	 * Delete ProductOptionType.
	 * @param  {string} productOptionTypeId - The id of the ProductOptionType.
	 */
	deleteProductOptionType(productOptionTypeId: string): Promise<void>;
}

export default IProductOptionTypeRepository;