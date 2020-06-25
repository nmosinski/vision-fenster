const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCart.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import List from "public/src/main/common/util/list/List.js"

/**
 * @class
 * Class representing a shopping cart.
 */
class ShoppingCart extends AbstractEntity
{
	/**
	 * Create ShoppingCart.
	 * @param {string} id - The id of ShoppingCart.
	 * @param {string} userId - The id of the user this cart belongs to.
	 * @param {List<ShoppingCartItem>} items - A list of ShoppingCartItems this ShoppingCart contains.
	 */
	constructor(id, userId, items=null)
	{
		super(id);
		this.userId = userId;
		this.items = items;
	}

	/**
	 * Add an item.
	 * @param {ShoppingCartItem} item - A ShoppingCartItem.
	 */
	addItem(item)
	{
		if(this._items.has(item))
			this._items.get(item.id).incCount();
		else
			this._items.add(item.id, item);
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
	 * @param {string} userId - The id of the member this shopping cart belongs to.
	 */
	set userId(userId)
	{
		this._userId = userId;
	}

	/**
	 * Set shoppingCartItems.
	 * @param {List<ShoppingCartItem>} items - A list with ShoppingCartItems.
	 */
	set items(items)
	{
		this._items = new ClonableKVMap();
		if(items instanceof List)
			items.foreach(item => {this.addItem(item);});
	}

	/**
	 * Get the id of the user this ShoppingCart belongs to.
	 * @return {string} The id of the user.
	 */
	get userId()
	{
		return this._userId;
	}

	/**
	 * Get a list of ShoppingCartItems that belong to this ShoppingCart.
	 * @return {List<ShoppingCartItem>} The list.
	 */
	get items()
	{
		return this._items.values().clone();
	}
}

export default ShoppingCart;