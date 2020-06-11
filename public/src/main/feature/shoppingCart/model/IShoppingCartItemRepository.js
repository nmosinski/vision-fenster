const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IShoppingCartItemRepository = (superclass=null) => 
{
	Object.defineProperty(IShoppingCartItemRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getShoppingCartItem) &&
		JsTypes.isFunction(instance.saveShoppingCartItem) &&
		JsTypes.isFunction(instance.updateShoppingCartItem) &&
		JsTypes.isFunction(instance.deleteShoppingCartItem) &&
		JsTypes.isFunction(instance.getShoppingCartItemsByShoppingCartId); 
	}, configurable: true});

	/**
	 * @alias IShoppingCartItemRepository
	 * @interface
	 */
	const C = class extends superclass
	{
		getShoppingCartItem(shoppingCartItemId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.getShoppingCartItem()");}

		getShoppingCartItemsByShoppingCartId(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.getShoppingCartItemsByShoppingCartId()");}

		saveShoppingCartItem(shoppingCartItem){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.saveShoppingCartItem()");}

		updateShoppingCartItem(shoppingCartItem){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.updateShoppingCartItem()");}

		deleteShoppingCartItem(shoppingCartItemId){throw new NotImplementedError(PATH, "IShoppingCartItemRepository.deleteShoppingCartItem()");}
	}

	return C;
}

export default IShoppingCartItemRepository;