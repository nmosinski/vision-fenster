const PATH = "public/main/feature/shoppingCart/model/ShoppingCartItem.js";

import AbstractModel from "public/main/common/AbstractModel.js"
import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"
import ShoppingCart from "public/main/common/ShoppingCart.js";

/**
 * @class
 * A class representing a shopping cart item.
 */
class ShoppingCartItem extends AbstractModel<ShoppingCartItem>
{
	private _image: string;
	private _singlePrice: number;
	private _details: string;
	private _shoppingCartId: string;
	private _productId: string;
	private _title: string;
	private _count: number;
	/**
	 * Create ShoppingCartItem.
	 * @param {string} id The id of this entity. 
	 * @param {string} shoppingCartId The id of the ShoppingCart this item belongs to.
	 * @param {string} productId The id of the product this item is refering to.
	 * @param {string} title The title of this item.
	 * @param {number} count The count of this item.
	 * @param {number} singlePrice The price for one item.
	 * @param {string} image The source to an image representing this item.
	 * @param {details} [details=null] The details about this item.
	 */
	constructor(id?: string, shoppingCartId?: string, productId?: string, title?: string, count?: number, singlePrice?: number, image?: string, details?: string)
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

	addRelations(): void 
	{
		/**
		 * @todo Circle constructor
		 */
	}

	newInstance(): ShoppingCartItem 
	{
		return new ShoppingCartItem();
	}

	/**
	 * @override
	 * @inheritdoc
	 */
	equals(o: ShoppingCartItem): boolean
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

	/**
	 * Increase the count of this item.
	 * @param {number} number The number on which the count of this item will be increased. 
	 */
	incCount(number: number=1): void
	{
		this.count += number;
	}

	/**
	 * Decrease the count of this item.
	 * @param {number} number The number on which the count of this item will be decreased. 
	 */
	decCount(number: number=1): void
	{
		this.count -= number;
	}

	/**
	 * @param {string} shoppingCartId
	 */
	set shoppingCartId(shoppingCartId: string)
	{
		this._shoppingCartId = shoppingCartId;
	}

	/**
	 * @param {string} productId
	 */
	set productId(productId: string)
	{
		this._productId = productId;
	}

	/**
	 * @param {string} title
	 */
	set title(title: string)
	{
		this._title = title;
	}

	/**
	 * @param {number} count
	 */
	set count(count: number)
	{
		this._count = count;
	}

	/**
	 * @param {number} singlePrice
	 */
	set singlePrice(singlePrice: number)
	{
		this._singlePrice = singlePrice;
	}

	/**
	 * @param {string} image The path to the image.
	 */
	set image(image: string)
	{
		this._image = image;
	}

	/**
	 * @param {string} details
	 */
	set details(details: string)
	{
		if(JsTypes.isString(details))
			this._details = details;
		else
			this._details = "";
	}

	/**
	 * @return {string}
	 */
	get shoppingCartId(): string
	{
		return this._shoppingCartId;
	}

	/**
	 * @return {string}
	 */
	get productId(): string
	{
		return this._productId;
	}

	/**
	 * @return {string}
	 */
	get title(): string
	{
		return this._title;
	}

	/**
	 * @return {number}
	 */
	get count(): number
	{
		return this._count;
	}

	/**
	 * @return {number}
	 */
	get singlePrice(): number
	{
		return this._singlePrice;
	}

	/**
	 * @return {number}
	 */
	get totalPrice(): number
	{
		return this._singlePrice * this._count;
	}

	/**
	 * @return {string} The path to the image.
	 */
	get image(): string
	{
		return this._image;
	}

	/**
	 * @return {string}
	 */
	get details(): string
	{
		return this._details;
	}
}

export default ShoppingCartItem;