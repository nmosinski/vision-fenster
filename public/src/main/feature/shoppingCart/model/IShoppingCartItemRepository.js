const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @interface
 * Interface representing a ShoppingCartItemRepository.
 */
const IShoppingCartItemRepository = (superclass=null) => 
{
	Object.defineProperty(IShoppingCartItemRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.nextIdentity) &&
		JsTypes.isFunction(instance.getShoppingCartItem) &&
		JsTypes.isFunction(instance.saveShoppingCartItem) &&
		JsTypes.isFunction(instance.updateShoppingCartItem) &&
		JsTypes.isFunction(instance.deleteShoppingCartItem) &&
		JsTypes.isFunction(instance.getShoppingCartItemsByShoppingCartId) &&
		JsTypes.isFunction(instance.saveMultipleShoppingCartItems) &&
		JsTypes.isFunction(instance.updateMultipleShoppingCartItems) &&
		JsTypes.isFunction(instance.deleteShoppingCartItemsByShoppingCartId); 
	}, configurable: true});

	/**
	 * @alias IShoppingCartItemRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		/**
		 * Get next identity for ShoppingCartItem.
		 * @return {string} The next identity.
		 */
		nextIdentity(){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.nextIdentity()");}

		/**
		 * Get ShoppingCartItem.
		 * @param {string} shoppingCartItemId - The id of ShoppingCartItem.
		 * @return {ShoppingCartItem} - The ShoppingCartItem.
		 */
		getShoppingCartItem(shoppingCartItemId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.getShoppingCartItem()");}

		/**
		 * Get ShoppingCartItems by a shopping cart id.
		 * @param {string} shoppingCartId - The id of the shopping cart the ShoppingCartItems will be returned for.
		 * @return {List<ShoppingCartItem>} - The ShoppingCartItems.
		 */
		getShoppingCartItemsByShoppingCartId(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId()");}

		/**
		 * Save ShoppingCartItem.
		 * @param {ShoppingCartItem} shoppingCartItem - The ShoppingCartItem.
		 */
		saveShoppingCartItem(shoppingCartItem){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.saveShoppingCartItem()");}
		
		/**
		 * Save a list of ShoppingCartItems.
		 * @param {List<ShoppingCartItem>} shoppingCartItems - The list containing ShoppingCartItems.
		 */
		saveMultipleShoppingCartItems(shoppingCartItems){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.saveMultipleShoppingCartItems()");}

		/**
		 * Update ShoppingCartItem.
		 * @param {ShoppingCartItem} shoppingCartItem - The ShoppingCartItem.
		 */
		updateShoppingCartItem(shoppingCartItem){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.updateShoppingCartItem()");}
		
		/**
		 * Update a list of ShoppingCartItems.
		 * @param {List<ShoppingCartItem>} shoppingCartItems - The list containing ShoppingCartItems.
		 */
		updateMultipleShoppingCartItems(shoppingCartItems){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.updateMultipleShoppingCartItems()");}

		/**
		 * Delete ShoppingCartItem.
		 * @param {string} shoppingCartItemId - The id of ShoppingCartItem.
		 */
		deleteShoppingCartItem(shoppingCartItemId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.deleteShoppingCartItem()");}
		
		/**
		 * Delete all ShoppingCartItems belonging to a ShoppingCart.
		 * @param {string} shoppingCartId - The id of the ShoppingCart the items will be deleted for.
		 */
		deleteShoppingCartItemsByShoppingCartId(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.deleteShoppingCartItemsByShoppingCartId()");}
	}

	return C;
}

export default IShoppingCartItemRepository;