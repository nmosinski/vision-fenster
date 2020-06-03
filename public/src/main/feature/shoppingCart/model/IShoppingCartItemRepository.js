const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js";

const IShoppingCartItemRepository = (superclass) => 

/**
 * @alias IShoppingCartItemRepository
 * @interface
 */
class extends superclass
{
	constructor(...args){super(args);}

	getShoppingCartItem(shoppingCartItemId){}

	saveShoppingCartItem(shoppingCartItem){}

	updateShoppingCartItem(shoppingCartItem){}

	deleteShoppingCartItemById(shoppingCartItemId){}
}

export default IShoppingCartItemRepository;