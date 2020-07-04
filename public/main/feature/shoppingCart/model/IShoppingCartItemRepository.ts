import ShoppingCartItem from "public/main/feature/shoppingCart/model/ShoppingCartItem.js"

import List from "../../../common/util/collections/list/List.js"

/**
 * @interface
 * Interface representing a ShoppingCartItemRepository.
 */
interface IShoppingCartItemRepository
{
	/**
	 * Get next identity for ShoppingCartItem.
	 * @return {string} The next identity.
	 */
	nextIdentity(): string;

	/**
	 * Get ShoppingCartItem.
	 * @param {string} shoppingCartItemId - The id of ShoppingCartItem.
	 * @return {Promise<ShoppingCartItem>} - The ShoppingCartItem.
	 */
	getShoppingCartItem(shoppingCartItemId: string): Promise<ShoppingCartItem>;

	/**
	 * Get ShoppingCartItems by a shopping cart id.
	 * @param {string} shoppingCartId - The id of the shopping cart the ShoppingCartItems will be returned for.
	 * @return {Promise<List<ShoppingCartItem>>} - The ShoppingCartItems.
	 */
	getShoppingCartItemsByShoppingCartId(shoppingCartId: string): Promise<List<ShoppingCartItem>>;

	/**
	 * Save ShoppingCartItem.
	 * @param {ShoppingCartItem} shoppingCartItem - The ShoppingCartItem.
	 */
	saveShoppingCartItem(shoppingCartItem: ShoppingCartItem): Promise<void>;
	
	/**
	 * Save a list of ShoppingCartItems.
	 * @param {List<ShoppingCartItem>} shoppingCartItems - The list containing ShoppingCartItems.
	 */
	saveMultipleShoppingCartItems(shoppingCartItems: List<ShoppingCartItem>): Promise<void>;

	/**
	 * Update ShoppingCartItem.
	 * @param {ShoppingCartItem} shoppingCartItem - The ShoppingCartItem.
	 */
	updateShoppingCartItem(shoppingCartItem: ShoppingCartItem): Promise<void>;
	
	/**
	 * Update a list of ShoppingCartItems.
	 * @param {List<ShoppingCartItem>} shoppingCartItems - The list containing ShoppingCartItems.
	 */
	updateMultipleShoppingCartItems(shoppingCartItems: List<ShoppingCartItem>): Promise<void>;

	/**
	 * Delete ShoppingCartItem.
	 * @param {string} shoppingCartItemId - The id of ShoppingCartItem.
	 */
	deleteShoppingCartItem(shoppingCartItemId: string): Promise<void>;
	
	/**
	 * Delete all ShoppingCartItems belonging to a ShoppingCart.
	 * @param {string} shoppingCartId - The id of the ShoppingCart the items will be deleted for.
	 */
	deleteShoppingCartItemsByShoppingCartId(shoppingCartId: string): Promise<void>;
}

export default IShoppingCartItemRepository;