import ProductCategory from "./ProductCategory";

interface IProductCategoryRepository
{
	/**
	 * Get a product category.
	 * @param {string} productCategoryId - The id of ProductCategory.
	 * @returns {Promise<ProductCategory>} a category of a product.
	 * @abstract
	 */
	getProductCategory(productCategoryid: string): Promise<ProductCategory>;

	/**
	 * Save a ProductCategory.
	 * @param {ProductCategory} productCategory The ProductCategory to be saved.
	 */
	saveProductCategory(productCategory: ProductCategory): Promise<void>;

	/**
	 * Update a ProductCategory.
	 * @param {ProductCategory} productCategory The ProductCategory to be updated.
	 */
	updateProductCategory(productCategory: ProductCategory): Promise<void>;

	/**
	 * Delete a ProductCategory.
	 * @param {string} productCategory The id of the ProductCategory to be deleted.
	 */
	deleteProductCategory(productCategoryId: string): Promise<void>;
}

export default IProductCategoryRepository;