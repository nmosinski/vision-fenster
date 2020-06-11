const PATH = "public/src/main/feature/product/model/IProductRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductRepository = (superclass=null) => 
{
	Object.defineProperty(IProductRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProduct) &&
		JsTypes.isFunction(instance.saveProduct) &&
		JsTypes.isFunction(instance.updateProduct) &&
		JsTypes.isFunction(instance.deleteProduct) &&
		JsTypes.isFunction(instance.getProductsByProductModelId); 
	}, configurable: true});

	/**
	 * @alias IProductRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		getProduct(productId){throw new NotImplementedError(PATH, "IProductRepository.getProduct()");}

		getProductsByProductModelId(productModelId){throw new NotImplementedError(PATH, "IProductRepository.getProductsByProductModelId()");}

		saveProduct(product){throw new NotImplementedError(PATH, "IProductRepository.saveProduct()");}

		updateProduct(product){throw new NotImplementedError(PATH, "IProductRepository.updateProduct()");}

		deleteProduct(productId){throw new NotImplementedError(PATH, "IProductRepository.deleteProduct()");}
	}

	return C;
}

export default IProductRepository;