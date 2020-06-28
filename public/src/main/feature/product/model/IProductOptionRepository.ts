import ProductOption from "public/src/main/feature/product/model/ProductOption";

interface IProductOptionRepository
{
	/**
	 * Get ProductOption.
	 * @param  {string} productOptionId - The id of ProductOption.
	 * @return {Promise<ProductOption>} The ProductOption.
	 */
	getProductOption(productOptionId: string): ProductOption;

	/**
	 * Save ProductOption.
	 * @param  {ProductOption} productOption - The ProductOption.
	 */
	saveProductOption(productOption: ProductOption): Promise<void>;

	/**
	 * Update ProductOption.
	 * @param  {ProductOption} productOption - The ProductOption.
	 */
	updateProductOption(productOption: ProductOption): Promise<void>;

	/**
	 * Delete ProductOption.
	 * @param {string} productOptionId - The id of the ProductOption.
	 */
	deleteProductOption(productOptionId: string): Promise<void>;
}

export default IProductOptionRepository;