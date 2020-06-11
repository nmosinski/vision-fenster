const PATH = "public/src/main/feature/product/model/IProductCategoryRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductCategoryRepository = (superclass=null) => 
{
	Object.defineProperty(IProductCategoryRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductCategory) &&
		JsTypes.isFunction(instance.saveProductCategory) &&
		JsTypes.isFunction(instance.updateProductCategory) &&
		JsTypes.isFunction(instance.deleteProductCategory); 
	}, configurable: true});
	/**
	 * @alias IProductCategoryRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get a product category.
		 * @param {string} productCategoryId - The id of ProductCategory.
		 * @returns {ProductCategory} a category of a product.
		 * @abstract
		 */
		getProductCategory(productCategoryid){throw new NotImplementedError(PATH, "IProductCategoryRepository.getProductCategory()");}

		saveProductCategory(productCategory){throw new NotImplementedError(PATH, "IProductCategoryRepository.saveProductCategory()");}

		updateProductCategory(productCategory){throw new NotImplementedError(PATH, "IProductCategoryRepository.updateProductCategory()");}

		deleteProductCategory(productCategoryId){throw new NotImplementedError(PATH, "IProductCategoryRepository.deleteProductCategory()");}
	}

	return C;
}

export default IProductCategoryRepository;