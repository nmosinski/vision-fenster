const PATH = "public/src/main/feature/order/model/OrderItem.js";

import AbstractModel from "public/src/main/common/AbstractModel.js"

/**
 * @class
 * A class representing an OrderItem.
 */
class OrderItem extends AbstractModel
{
	private _price: number;
	private _productId: string;
	private _orderId: string;
	/**
	 * Create OrderItem.
	 * @param {string} id The id of this entity.
	 * @param {string} orderId The id of the order this item belongs to.
	 * @param {string} productId The id of the product this OrderItem refers to.
	 * @param {number} price The price of this OrderItem.
	 */
	constructor(id: string, orderId: string, productId: string, price: number)
	{
		super(id);
		this.orderId = orderId;
		this.productId = productId;
		this.price = price;
	}

	/**
	 * @param {string} orderId
	 */
	set orderId(orderId: string)
	{
		this._orderId = orderId;
	}

	/**
	 * @param {string} productId
	 */
	set productId(productId: string)
	{
		this._productId = productId;
	}

	/**
	 * @param {number} price
	 */
	set price(price: number)
	{
		this._price = price;
	}

	/**
	 * @return {string}
	 */
	get orderId(): string
	{
		return this._orderId;
	}

	/**
	 * @returns {string}
	 */
	get productId(): string
	{
		return this._productId;
	}

	/**
	 * @returns {number}
	 */
	get price(): number
	{
		return this._price;
	}
}

export default OrderItem;