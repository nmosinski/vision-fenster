const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCart.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

import ClonableKVMap from "public/src/main/common/util/map/ClonableKVMap.js"
import List from "public/src/main/common/util/list/List.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

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
	 * Set count of an item. Remove the item from cart if count is 0.
	 * @param {string} itemId - The id of the item the count will be set for.
	 * @param {number} count - The new count.
	 */
	setCountOfItem(itemId, count)
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "this.changeCountOfItem()", itemId, "string");
		if(!JsTypes.isNumber(count))
			throw new VariableTypeError(PATH, "this.changeCountOfItem()", count, "number");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "this.changeCountOfItem()", itemId, "not empty");
		if(count < 0)
			throw new VariableValueError(PATH, "this.changeCountOfItem()", count, "count > -1");
		
		if(count === 0)
			this.removeItem(itemId);
		else
			this._items.get(itemId).count = count;
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
			this._items.add(item.id, item.clone());
	}

	/**
	 * Get an item.
	 * @param {string} id - The id of the ShoppingCartItem to be removed.
	 * @return {ShoppingCartItem} The ShoppingCartItem.
	 */
	getItem(id)
	{
		let item = this._items.get(id);
		
		if(!JsTypes.isUnspecified(item))
			return this._items.get(id).clone();
		else
			return null;
	}

	/**
	 * Remove an item.
	 * @param {string} id - The if of the ShoppingCartItem to be removed.
	 */
	removeItem(id)
	{
		this._items.remove(id);
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