const PATH = "public/main/feature/shoppingCart/model/ShoppingCart.js";

import ShoppingCartItem from "public/main/feature/shoppingCart/model/ShoppingCartItem.js"

import AbstractModel from "public/main/common/AbstractModel.js"
import Associations from "public/main/common/Associations.js"

import KVMap from "../../../common/util/collections/map/KVMap.js"
import List from "../../../common/util/collections/list/List.js"
import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/main/common/util/error/VariableValueError.js"

/**
 * @class
 * Class representing a shopping cart.
 */
class ShoppingCart extends AbstractModel
{
	static self = ShoppingCart;
	static tableName: string = "ShoppingCart";
	protected associations: Associations;
	private _userId: string;
	private _items: KVMap<string, ShoppingCartItem>;

	

	/**
	 * Create ShoppingCart.
	 * @param {string} id - The id of ShoppingCart.
	 * @param {string} userId - The id of the user this cart belongs to.
	 * @param {List<ShoppingCartItem>} items - A list of ShoppingCartItems this ShoppingCart contains.
	 */
	constructor(id?: string, userId?: string, items?: List<ShoppingCartItem>)
	{
		super(id);
		this.userId = userId;
		this.items = items;
	}

	static create(id?: string, userId?: string, items?: List<ShoppingCartItem>)
	{
		let model = new ShoppingCart(id, userId, items);
		
		this.associations = new Associations().
		hasChildren(ShoppingCartItem).
		hasParents();
	}


	/**
	 * Set count of an item. Remove the item from cart if count is 0.
	 * @param {string} itemId - The id of the item the count will be set for.
	 * @param {number} count - The new count.
	 */
	setCountOfItem(itemId: string, count: number): void
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
	addItem(item: ShoppingCartItem): void
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
	getItem(id: string): ShoppingCartItem
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
	removeItem(id: string): void
	{
		this._items.remove(id);
	}

	/**
	 * Get total price of this shopping cart.
	 * @return {number} The total price.
	 */
	getTotalPrice(): number
	{
		let price = 0;

		this._items.values().foreach(item => {price += item.totalPrice;});
		return price;
	}

	/**
	 * Set the id of the member this shopping cart belongs to.
	 * @param {string} userId - The id of the member this shopping cart belongs to.
	 */
	set userId(userId: string)
	{
		this._userId = userId;
	}

	/**
	 * Set shoppingCartItems.
	 * @param {List<ShoppingCartItem>} items - A list with ShoppingCartItems.
	 */
	set items(items: List<ShoppingCartItem>)
	{
		this._items = new KVMap<string, ShoppingCartItem>();
		if(items instanceof List)
			items.foreach(item => {this.addItem(item);});
	}

	/**
	 * Get the id of the user this ShoppingCart belongs to.
	 * @return {string} The id of the user.
	 */
	get userId(): string
	{
		return this._userId;
	}

	/**
	 * Get a list of ShoppingCartItems that belong to this ShoppingCart.
	 * @return {List<ShoppingCartItem>} The list.
	 */
	get items(): List<ShoppingCartItem>
	{
		return this._items.values().copy();
	}
}

export default ShoppingCart;