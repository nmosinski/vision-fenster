import ShoppingCart from "public/src/main/feature/shoppingCart/model/ShoppingCart.js"


/**
 * @interface
 * Interface representing a ShoppingCartRepository.
 */
interface IShoppingCartRepository
{
	/**
	 * Get next identity for ShoppingCart.
	 * @return {string} The next identity.
	 */
	nextIdentity(): string;

	/**
	 * Get ShoppingCart.
	 * @param {string} shoppingCartId - The id of ShoppingCart.
	 * @return {Promise<ShoppingCart>} - The ShoppingCart.
	 */
	getShoppingCart(shoppingCartId: string): Promise<ShoppingCart>;
	/**
	 * Get ShoppingCart by user id.
	 * @param {string} userId - The id of the user.
	 * @return {Promise<ShoppingCart>} - The ShoppingCart.
	 */
	getShoppingCartByUserId(userId: string): Promise<ShoppingCart>;

	/**
	 * Save ShoppingCart.
	 * @param {ShoppingCart} shoppingCart - The ShoppingCart.
	 */
	saveShoppingCart(shoppingCart: ShoppingCart): Promise<void>;

	/**
	 * Update ShoppingCart.
	 * @param {ShoppingCart} shoppingCart - The ShoppingCart.
	 */
	updateShoppingCart(shoppingCart: ShoppingCart): Promise<void>;

	/**
	 * Delete ShoppingCart.
	 * @param {string} shoppingCartId - The id of ShoppingCart.
	 */
	deleteShoppingCart(shoppingCartId: string): Promise<void>;
}

export default IShoppingCartRepository;