const PATH = "public/src/main/feature/shoppingCart/model/IProductRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IProductRepository = (superclass=null) => 
{
	Object.defineProperty(IProductRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getProduct);
	}, configurable: true});

	/**
	 * @alias IProductRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get Product.
		 * @param  {string} productId - The id of Product.
		 * @return {Product} The Product.
		 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
		 */
		getProduct(productId){throw new NotImplementedError(PATH, "IProductRepository.getProduct()");}
	}

	return C;
}

export default IProductRepository;