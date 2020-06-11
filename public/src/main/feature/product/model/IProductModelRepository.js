const PATH = "public/src/main/feature/product/model/IProductModelRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductModelRepository = (superclass=null) => 
{
	Object.defineProperty(IProductModelRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductModel) &&
		JsTypes.isFunction(instance.saveProductModel) &&
		JsTypes.isFunction(instance.updateProductModel) &&
		JsTypes.isFunction(instance.deleteProductModel); 
	}, configurable: true});
	
	/**
	 * @alias IProductModelRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		getProductModel(productModelId){throw new NotImplementedError(PATH, "IProductModelRepository.getProductModel()");}

		saveProductModel(productModel){throw new NotImplementedError(PATH, "IProductModelRepository.saveProductModel()");}

		updateProductModel(productModel){throw new NotImplementedError(PATH, "IProductModelRepository.updateProductModel()");}

		deleteProductModel(productModelId){throw new NotImplementedError(PATH, "IProductModelRepository.deleteProductModel()");}
	}

	return C;
}

export default IProductModelRepository;