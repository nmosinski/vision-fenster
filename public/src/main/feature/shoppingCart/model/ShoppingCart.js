const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCart.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"

/**
 * @class
 * Class representing a shopping cart.
 */
class ShoppingCart extends AbstractEntity
{
	/**
	 * Create ShoppingCart.
	 * @param {string} id - The id of ShoppingCart.
	 * @param {string} memberId - The id of the member this cart belongs to.
	 * @param {List<ShoppingCartItems>} items - A list of ShoppingCartItems this ShoppingCart contains.
	 */
	constructor(id, memberId, items)
	{
		super(id);
		this.memberId = memberId;
		this.items = items;
	}

	/**
	 * Add an item.
	 * @param {ShoppingCartItem} item - A ShoppingCartItem.
	 */
	addItem(item)
	{
		this._shoppingCartItems.add(item.id, item);
	}

	/**
	 * Get an item.
	 * @param {string} id - The id of the ShoppingCartItem to be removed.
	 * @return {ShoppingCartItem} The ShoppingCartItem.
	 */
	getItem(id)
	{
		return this._items.get(id);
	}

	/**
	 * Remove an item.
	 * @param {string} id - The if of the ShoppingCartItem to be removed.
	 */
	removeItem(id)
	{
		this._items.delete(id);
	}

	/**
	 * Get total price of this shopping cart.
	 * @return {number} The total price.
	 */
	getTotalPrice()
	{
		let price = 0;

		this._items.values().foreach(item => {price += item.getTotalPrice();});
		return price;
	}

	/**
	 * Set the id of the member this shopping cart belongs to.
	 * @param {string} memberId - The id of the member this shopping cart belongs to.
	 */
	set memberId(memberId)
	{
		this._memberId = memberId;
	}

	/**
	 * Set shoppingCartItems.
	 * @param {List<ShoppingCartItem>} items - A list with ShoppingCartItems.
	 */
	set items(items)
	{
		this._items = new ClonableKVMap();

		items.foreach(item => {this.addItem(item);});
	}

	/**
	 * Get the id of the member this ShoppingCart belongs to.
	 * @return {string} The id of the member.
	 */
	get memberId()
	{
		return this._memberId;
	}

	/**
	 * Get a list of ShoppingCartItems that belong to this ShoppingCart.
	 * @return {List<ShoppingCartItem>} The list.
	 */
	get items()
	{
		return this._items.values();
	}
}

export default ShoppingCart;