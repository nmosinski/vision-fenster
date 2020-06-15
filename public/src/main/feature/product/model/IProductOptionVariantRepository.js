const PATH = "public/src/main/feature/product/model/IProductOptionVariantRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductOptionVariantRepository = (superclass=null) => 
{
	Object.defineProperty(IProductOptionVariantRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductOptionVariant) &&
		JsTypes.isFunction(instance.saveProductOptionVariant) &&
		JsTypes.isFunction(instance.updateProductOptionVariant) &&
		JsTypes.isFunction(instance.deleteProductOptionVariant) &&
		JsTypes.isFunction(instance.getProductOptionVariantsByProductOptionTypeId); 
	}, configurable: true});

	/**
	 * @alias IProductOptionVariantRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get ProductOptionVariant.
		 * @param  {string} ProductOptionVariantId - The id of ProductOptionVariant.
		 * @return {ProductOptionVariant} The ProductOptionVariant.
		 */
		getProductOptionVariant(productOptionVariantId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.getProductOptionVariant()");}

		/**
		 * Get all ProductOptionVariants with the given product option type id.
		 * @param  {string} productOptionTypeId - The product option type id.
		 * @return {List<ProductOptionVariant>} A list with the requested ProductOptionVariants.
		 */
		getProductOptionVariantsByProductOptionTypeId(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.getProductOptionVariantsByProductOptionTypeId()");}

		/**
		 * Save ProductOptionVariant.
		 * @param  {ProductOptionVariant} productOptionVariant - The ProductOptionVariant.
		 */
		saveProductOptionVariant(productOptionVariant){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.saveProductOptionVariant()");}

		/**
		 * Update ProductOptionVariant.
		 * @param  {ProductOptionVariant} productOptionVariant - The ProductOptionVariant.
		 */
		updateProductOptionVariant(productOptionVariant){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.updateProductOptionVariant()");}

		/**
		 * Delete ProductOptionVariant.
		 * @param  {string} productOptionVariantId - The id of the ProductOptionVariant.
		 */
		deleteProductOptionVariant(productOptionVariantId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.deleteProductOptionVariant()");}
	}

	return C;
}

export default IProductOptionVariantRepository;