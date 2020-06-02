const PATH = "public/src/main/feature/order/model/OrderItem.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class OrderItem
{
	constructor(id, orderId, productId, price)
	{
		super(id);
		this.orderId = orderId;
		this.productId = productId;
		this.price = price;
	}

	set orderId(orderId)
	{
		this._orderId = orderId;
	}

	set productId(productId)
	{
		this._productId = productId;
	}

	set price(price)
	{
		this._price = price;
	}

	get orderId()
	{
		return this._orderId;
	}

	get productId()
	{
		return this._productId;
	}

	get price()
	{
		return this._price;
	}
}