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
		getProductOptionType(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.getProductOptionType()");}

		getProductOptionTypesByProductModelId(productModelId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.getProductOptionTypesByProductModelId()");}

		saveProductOptionType(productOptionType){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.saveProductOptionType()");}

		updateProductOptionType(productOptionType){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.updateProductOptionType()");}

		deleteProductOptionType(productOptionTypeId){throw new NotImplementedError(PATH, "IProductOptionTypeRepository.deleteProductOptionType()");}
	}

	return C;
}

export default IProductOptionTypeRepository;