const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js";

import NotImplementedError from "public/src/main/common/util/error/NotImplementedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

const IShoppingCartRepository = (superclass=null) => 
{
	Object.defineProperty(IShoppingCartRepository, Symbol.hasInstance, {value: function(instance) { 
		return JsTypes.isFunction(instance.getShoppingCart) &&
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
		getShoppingCart(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartRepository.getShoppingCart()");}

		saveShoppingCart(shoppingCart){throw new NotImplementedError(PATH, "IShoppingCartRepository.saveShoppingCart()");}

		updateShoppingCart(shoppingCart){throw new NotImplementedError(PATH, "IShoppingCartRepository.updateShoppingCart()");}

		deleteShoppingCart(shoppingCartId){throw new NotImplementedError(PATH, "IShoppingCartRepository.deleteShoppingCart()");}
	}

	return C;
}

export default IShoppingCartRepository;