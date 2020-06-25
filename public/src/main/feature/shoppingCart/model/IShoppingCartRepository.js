const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @interface
 * Interface representing a ShoppingCartRepository.
 */
const IShoppingCartRepository = (superclass=null) => 
{
	Object.defineProperty(IShoppingCartRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.nextIdentity) &&
		JsTypes.isFunction(instance.getShoppingCart) &&
		JsTypes.isFunction(instance.saveShoppingCart) &&
		JsTypes.isFunction(instance.updateShoppingCart) &&
		JsTypes.isFunction(instance.deleteShoppingCart); 
	}, configurable: true});

	/**
	 * @alias IShoppingCartRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get next identity for ShoppingCart.
		 * @return {string} The next identity.
		 */
		nextIdentity(){throw new NotImplementedError(PATH, "IShoppingCartRepository.nextIdentity()");}

		/**
		 * Get ShoppingCart.
		 * @param {string} shoppingCartId - The id of ShoppingCart.
		 * @return {ShoppingCart} - The ShoppingCart.
		 */
		getShoppingCart(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartRepository.getShoppingCart()");}

		/**
		 * Get ShoppingCart by member id.
		 * @param {string} memberId - The id of the member.
		 * @return {ShoppingCart} - The ShoppingCart.
		 */
		getShoppingCartByMemberId(memberId){throw new NotImplementedError(PATH, "IShoppingCartRepository.getShoppingCartByMemberId()");}

		/**
		 * Save ShoppingCart.
		 * @param {ShoppingCart} shoppingCart - The ShoppingCart.
		 */
		saveShoppingCart(shoppingCart){throw new NotImplementedError(PATH, "IShoppingCartRepository.saveShoppingCart()");}

		/**
		 * Update ShoppingCart.
		 * @param {ShoppingCart} shoppingCart - The ShoppingCart.
		 */
		updateShoppingCart(shoppingCart){throw new NotImplementedError(PATH, "IShoppingCartRepository.updateShoppingCart()");}

		/**
		 * Delete ShoppingCart.
		 * @param {string} shoppingCartId - The id of ShoppingCart.
		 */
		deleteShoppingCart(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartRepository.deleteShoppingCart()");}
	}

	return C;
}

export default IShoppingCartRepository;