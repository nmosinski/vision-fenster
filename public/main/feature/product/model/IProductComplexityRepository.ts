/*
const PATH = "public/main/feature/product/model/IProductComplexityRepository.js";

import NotImplementedError from "public/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

const IProductComplexityRepository = (superclass=null) => 
{
	Object.defineProperty(IProductComplexityRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProductComplexity) &&
		JsTypes.isFunction(instance.saveProductComplexity) &&
		JsTypes.isFunction(instance.updateProductComplexity) &&
		JsTypes.isFunction(instance.deleteProductComplexity); 
	}, configurable: true});
	
	
	const C = class extends superclass
	{
		getProductComplexity(productComplexityId){throw new NotImplementedError(PATH, "IProductComplexityRepository.getProductComplexity()");}

		saveProductComplexity(productComplexity){throw new NotImplementedError(PATH, "IProductComplexityRepository.saveProductComplexity()");}

		updateProductComplexity(productComplexity){throw new NotImplementedError(PATH, "IProductComplexityRepository.updateProductComplexity()");}

		deleteProductComplexity(productComplexityId){throw new NotImplementedError(PATH, "IProductComplexityRepository.deleteProductComplexity()");}
	}

	return C;
}

export default IProductComplexityRepository;
*/