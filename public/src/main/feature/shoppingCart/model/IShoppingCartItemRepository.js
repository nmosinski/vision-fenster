const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartItemRepository.js";

const IShoppingCartItemRepository = (superclass=null) => 

/**
 * @alias IShoppingCartItemRepository
 * @interface
 */
class extends superclass
{
	getShoppingCartItem(shoppingCartItemId){}

	saveShoppingCartItem(shoppingCartItem){}

	updateShoppingCartItem(shoppingCartItem){}

	deleteShoppingCartItemById(shoppingCartItemId){}
}

export default IShoppingCartItemRepository;