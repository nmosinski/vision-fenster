const PATH = "public/src/main/feature/order/model/Order.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import List from "public/src/main/common/util/list/List.js"
import OrderItem from "public/src/main/feature/order/model/OrderItem.js"

/**
 * @class
 * A class representing an Order.
 */
class Order extends AbstractEntity
{
	private _orderItems: List<OrderItem>;
	private _userId: string;
	/**
	 * Create Order.
	 * @param {string} id The id of this entity.
	 * @param {string} userId The id of the user this order belongs to.
	 * @param {List<OrderItem>} orderItems A List of the order items that belong to this order.
	 */
	constructor(id: string, userId: string, orderItems: List<OrderItem>)
	{
		super(id);
		this.userId = userId;
		this.orderItems = orderItems;
	}

	/**
	 * @param {string} userId The id of the user this order belongs to.
	 */
	set userId(userId: string)
	{
		this._userId = userId;
	}

	/**
	 * @param {List<OrderItem>} orderItems
	 */
	set orderItems(orderItems: List<OrderItem>)
	{
		this._orderItems = orderItems;
	}

	/**
	 * @returns {string} The id of the user this order belogns to.
	 */
	get userId(): string
	{
		return this._userId;
	}

	/**
	 * @returns {List<OrderItem>} A List of OrderItems this Order has.
	 */
	get orderItems(): List<OrderItem>
	{
		return this._orderItems;
	}
}

export default Order;