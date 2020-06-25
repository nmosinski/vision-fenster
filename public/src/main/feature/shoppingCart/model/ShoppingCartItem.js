const PATH = "public/src/main/feature/shoppingCart/model/ShoppingCartItem.js";

import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

class ShoppingCartItem extends IClonable(IComparable(AbstractEntity))
{
	constructor(id, shoppingCartId, productId, title, count, singlePrice, image, details=null)
	{
		super(id);
		this.shoppingCartId = shoppingCartId;
		this.productId = productId;
		this.title = title;
		this.count = count;
		this.singlePrice = singlePrice;
		this.image = image;
		this.details = details;
	}

	equals(o)
	{
		if(!(o instanceof ShoppingCartItem))
			return false;
		if(this.id !== o.id)
			return false;
		if(this.shoppingCartId !== o.shoppingCartId)
			return false;
		if(this.productId !== o.productId)
			return false;
		if(this.title !== o.title)
			return false;
		if(this.count !== o.count)
			return false;
		if(this.singlePrice !== o.singlePrice)
			return false;
		if(this.details !== o.details)
			return false;
		if(this.image !== o.image)
			return false;

		return true;
	}

	clone()
	{
		return new ShoppingCartItem(this.id, this.shoppingCartId, this.productId, this.title, this.count, this.singlePrice, this.image, this.details)
	}

	incCount(number=1)
	{
		this.count += number;
	}

	decCount(number=1)
	{
		this.count -= number;
	}

	set shoppingCartId(shoppingCartId)
	{
		this._shoppingCartId = shoppingCartId;
	}

	set productId(productId)
	{
		this._productId = productId;
	}

	set title(title)
	{
		this._title = title;
	}

	set count(count)
	{
		this._count = count;
	}

	set singlePrice(singlePrice)
	{
		this._singlePrice = singlePrice;
	}

	set image(image)
	{
		this._image = image;
	}

	set details(details)
	{
		if(JsTypes.isString(details))
			this._details = details;
		else
			this._details = "";
	}

	get shoppingCartId()
	{
		return this._shoppingCartId;
	}

	get productId()
	{
		return this._productId;
	}

	get title()
	{
		return this._title;
	}

	get count()
	{
		return this._count;
	}

	get singlePrice()
	{
		return this._singlePrice;
	}

	get totalPrice()
	{
		return this._singlePrice * this._count;
	}

	get image()
	{
		return this._image;
	}

	get details()
	{
		return this._details;
	}
}

export default ShoppingCartItem;