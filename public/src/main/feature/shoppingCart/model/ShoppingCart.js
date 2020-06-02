const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCart.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class ShoppingCart
{
	constructor(id, memberId, shoppingCartItems)
	{
		super(id);
		this.memberId = memberId;
		this.shoppingCartItems = shoppingCartItems;
	}

	set memberId(memberId)
	{
		this._memberId = memberId;
	}

	set shoppingCartItems(shoppingCartItems)
	{
		this._shoppingCartItems = shoppingCartItems;
	}

	get memberId()
	{
		return this._memberId;
	}

	get shoppingCartItems()
	{
		return this._shoppingCartItems;
	}
}