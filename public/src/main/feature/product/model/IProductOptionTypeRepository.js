const PATH = "public/src/main/feature/product/model/IProductOptionTypeRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductOptionTypeRepository = (superclass=null) => 
{
	Object.defineProperty(IProductOptionTypeRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductOptionType) &&
		JsTypes.isFunction(instance.saveProductOptionType) &&
		JsTypes.isFunction(instance.updateProductOptionType) &&
		JsTypes.isFunction(instance.deleteProductOptionType) &&
		JsTypes.isFunction(instance.getProductOptionTypesByProductModelId); 
	}, configurable: true});
	
	/**
	 * @alias IProductOptionTypeRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get ProductOptionType.
		 * @param  {string} productOptionTypeId - The id of ProductOptionType.
		 * @return {ProductOptionType} The ProductOptionType.
		 */
		getProductOptionType(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.getProductOptionType()");}

		/**
		 * Get all ProductOptionTypes with the given product model id.
		 * @param  {string} productModelId - The product model id.
		 * @return {List<ProductOptionType>} A list with the requested ProductOptionTypes.
		 */
		getProductOptionTypesByProductModelId(productModelId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.getProductOptionTypesByProductModelId()");}

		/**
		 * Save ProductOptionType.
		 * @param  {ProductOptionType} productOptionType - The ProductOptionType.
		 */
		saveProductOptionType(productOptionType){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.saveProductOptionType()");}

		/**
		 * Update ProductOptionType.
		 * @param  {ProductOptionType} productOptionType - The ProductOptionType.
		 */
		updateProductOptionType(productOptionType){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.updateProductOptionType()");}

		/**
		 * Delete ProductOptionType.
		 * @param  {string} productOptionTypeId - The id of the ProductOptionType.
		 */
		deleteProductOptionType(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.deleteProductOptionType()");}
	}

	return C;
}

export default IProductOptionTypeRepository;