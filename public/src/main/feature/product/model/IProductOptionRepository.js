const PATH = "public/src/main/feature/product/model/IProductOptionRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductOptionRepository = (superclass=null) => 
{
	Object.defineProperty(IProductOptionRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductOption) &&
		JsTypes.isFunction(instance.saveProductOption) &&
		JsTypes.isFunction(instance.updateProductOption) &&
		JsTypes.isFunction(instance.deleteProductOption); 
	}, configurable: true});
	
	/**
	 * @alias IProductOptionRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get ProductOption.
		 * @param  {string} productOptionId - The id of ProductOption.
		 * @return {ProductOption} The ProductOption.
		 */
		getProductOption(productOptionId){throw new NotImplementedError(PATH, "IProductOptionRepository.getProductOption()");}

		/**
		 * Save ProductOption.
		 * @param  {ProductOption} productOption - The ProductOption.
		 */
		saveProductOption(productOption){throw new NotImplementedError(PATH, "IProductOptionRepository.saveProductOption()");}

		/**
		 * Update ProductOption.
		 * @param  {ProductOption} productOption - The ProductOption.
		 */
		updateProductOption(productOption){throw new NotImplementedError(PATH, "IProductOptionRepository.updateProductOption()");}

		/**
		 * Delete ProductOption.
		 * @param {string} productOptionId - The id of the ProductOption.
		 */
		deleteProductOption(productOptionId){throw new NotImplementedError(PATH, "IProductOptionRepository.deleteProductOption()");}
	}

	return C;
}

export default IProductOptionRepository;