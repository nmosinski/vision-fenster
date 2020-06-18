const PATH = "public/src/main/feature/order/model/Order.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

class Order
{
	constructor(id, memberId, orderItems)
	{
		super(id);
		this.memberId = memberId;
		this.orderItems = orderItems;
	}

	set memberId(memberId)
	{
		this._memberId = memberId;
	}

	set orderItems(orderItems)
	{
		this._orderItems = orderItems;
	}

	get memberId()
	{
		return this._memberId;
	}

	get orderItems()
	{
		return this._orderItems;
	}
}

export default Order;