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
		getProductOptionVariant(productOptionVariantId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.getProductOptionVariant()");}

		getProductOptionVariantsByProductOptionTypeId(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.getProductOptionVariantsByProductOptionTypeId()");}

		saveProductOptionVariant(productOptionVariant){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.saveProductOptionVariant()");}

		updateProductOptionVariant(productOptionVariant){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.updateProductOptionVariant()");}

		deleteProductOptionVariant(productOptionVariantId){throw new NotImplementedError(PATH, "IProductOptionVariantRepository.deleteProductOptionVariant()");}
	}

	return C;
}

export default IProductOptionVariantRepository;