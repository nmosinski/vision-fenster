import AbstractModel, { Properties } from "../../../common/orm/AbstractModel";
import ShoppingCartItem from "./ShoppingCartItem";

const PATH = "public/main/feature/shoppingCart/model/ShoppingCart.js";



/**
 * @class
 * Class representing a shopping cart.
 */
class ShoppingCart extends AbstractModel<ShoppingCart>
{
	protected _properties: Properties;
	protected Constructor: new () => ShoppingCart = ShoppingCart;
	private _userId: string;
	

	/**
	 * Create ShoppingCart.
	 * @param {string} [id=null] - The id of ShoppingCart.
	 * @param {string} [userId=null] - The id of the user this cart belongs to.
	 */
	constructor(data?:{pk?: string, userId?: string})
	{
		super(data);
	}

	addProperties(): void 
	{

	}

	addRelations(): void 
	{
		this.oneToMany(ShoppingCartItem);
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