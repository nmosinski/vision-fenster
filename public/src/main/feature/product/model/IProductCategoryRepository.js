const PATH = "public/src/main/feature/product/model/IProductCategoryRepository.js";

const IProductCategoryRepository = (superclass=null) => 
/**
 * @alias IProductCategoryRepository
 * @interface
 */
class extends superclass
{
	/**
	 * Get a product category.
	 * @param {string} productCategoryId - The id of ProductCategory.
	 * @returns {ProductCategory} a category of a product.
	 * @abstract
	 */
	getProductCategory(productCategoryid){}

	saveProductCategory(productCategory){}

	updateProductCategory(productCategory){}

	saveProductCategory(productCategory){}

	deleteProductCategory(productCategoryId){}
}

export default IProductCategoryRepository;