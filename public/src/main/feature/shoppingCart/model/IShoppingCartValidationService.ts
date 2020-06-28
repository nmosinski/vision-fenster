import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"

/**
 * @interface
 * Interface representing an validation service for shopping cart.
 */
interface IShoppingCartValidationService
{
	/**
	 * Validates the update request.
	 * @param {ShoppingCart} oldShoppingCart - ShoppingCart before update.
	 * @param {ShoppingCart} newShoppingCart - ShoppingCart after update.
	 * @return {string} - True if the update is valid, else false.
	 */
	shoppingCartUpdateRequest(oldShoppingCart: ShoppingCart, newShoppingCart: ShoppingCart): string;
}

export default IShoppingCartValidationService;