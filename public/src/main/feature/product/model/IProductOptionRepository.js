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
		getProductOption(productOptionId){throw new NotImplementedError(PATH, "IProductOptionRepository.getProductOption()");}

		saveProductOption(productOption){throw new NotImplementedError(PATH, "IProductOptionRepository.saveProductOption()");}

		updateProductOption(productOption){throw new NotImplementedError(PATH, "IProductOptionRepository.updateProductOption()");}

		deleteProductOption(productOptionId){throw new NotImplementedError(PATH, "IProductOptionRepository.deleteProductOption()");}
	}

	return C;
}

export default IProductOptionRepository;