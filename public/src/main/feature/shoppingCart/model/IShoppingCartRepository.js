const PATH = "public/src/main/feature/shoppingCart/model/IShoppingCartRepository.js";

const IShoppingCartRepository = (superclass=null) => 

/**
 * @alias IShoppingCartRepository
 * @interface
 */
class extends superclass
{
	getShoppingCart(shoppingCartId){}

	saveShoppingCart(shoppingCart){}

	updateShoppingCart(shoppingCart){}

	deleteShoppingCartById(shoppingCartId){}
}

export default IShoppingCartRepository;