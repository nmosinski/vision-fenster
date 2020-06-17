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
		JsTypes.isFunction(instance.getProductsByProductModelId) &&
		JsTypes.isFunction(instance.nextIdentity); 
	}, configurable: true});

	/**
	 * @alias IProductRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get the next identity for this entity.
		 * @return {string} The next idendity.
		 */
		nextIdentity(){throw new NotImplementedError(PATH, "IProductRepository.nextIdentity()");}

		/**
		 * Get Product.
		 * @param  {string} productId - The id of Product.
		 * @return {Product} The Product.
		 * @throws {EntityNotFoundError} If the requested entity doesnt't exist.
		 */
		getProduct(productId){throw new NotImplementedError(PATH, "IProductRepository.getProduct()");}

		/**
		 * Get all Products with the given product model id.
		 * @param  {string} productModelId - The product model id.
		 * @return {List<Product>} A list with the requested Products.
		 * @throws {EntityNotFoundError} If no entity matching the request exists.
		 */
		getProductsByProductModelId(productModelId){throw new NotImplementedError(PATH, "IProductRepository.getProductsByProductModelId()");}

		/**
		 * Save Product.
		 * @param  {Product} product - The Product.
		 */
		saveProduct(product){throw new NotImplementedError(PATH, "IProductRepository.saveProduct()");}

		/**
		 * Update Product.
		 * @param  {Product} product - The Product.
		 */
		updateProduct(product){throw new NotImplementedError(PATH, "IProductRepository.updateProduct()");}

		/**
		 * Delete Product.
		 * @param  {string} productId - The id of the Product.
		 */
		deleteProduct(productId){throw new NotImplementedError(PATH, "IProductRepository.deleteProduct()");}
	}

	return C;
}

export default IProductRepository;