const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

class ShoppingCartItem extends AbstractEntity
{
	constructor(id, shoppingCartId, productId, count, singlePrice)
	{
		super(id);
		this.shoppingCartId = shoppingCartId;
		this.productId = productId;
		this.count = count;
		this.singlePrice = singlePrice;
	}

	set shoppingCartId(shoppingCartId)
	{
		this._shoppingCartId = shoppingCartId;
	}

	set productId(productId)
	{
		this._productId = productId;
	}

	set count(count)
	{
		this._count = count;
	}

	set singlePrice(singlePrice)
	{
		this._singlePrice = singlePrice;
	}

	get shoppingCartId()
	{
		return this._shoppingCartId;
	}

	get productId()
	{
		return this._productId;
	}

	get count()
	{
		return this._count;
	}

	get singlePrice()
	{
		return this._singlePrice;
	}
}

export default ShoppingCartItem;