const PATH = "public/main/feature/shoppingCart/model/ShoppingCart.js";

import ShoppingCartItem from "public/main/feature/shoppingCart/model/ShoppingCartItem.js"

import AbstractModel from "public/main/common/AbstractModel.js"
/**
 * @class
 * Class representing a shopping cart.
 */
class ShoppingCart extends AbstractModel<ShoppingCart>
{
	private _userId: string;

	

	/**
	 * Create ShoppingCart.
	 * @param {string} [id=null] - The id of ShoppingCart.
	 * @param {string} [userId=null] - The id of the user this cart belongs to.
	 */
	constructor(id?: string, userId?: string)
	{
		super(id);
		this.userId = userId;
	}

	addRelations(): void 
	{
		this.manyToOne(ShoppingCartItem);
	}
	newInstance(): ShoppingCart 
	{
		return new ShoppingCart();
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
	 * Get the id of the user this ShoppingCart belongs to.
	 * @return {string} The id of the user.
	 */
	get userId(): string
	{
		return this._userId;
	}
}

export default ShoppingCart;