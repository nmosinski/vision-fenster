const PATH = "public/src/main/feature/product/model/Product.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class Product extends AbstractEntity
{
	constructor(id, productModelId, productOptionVariants, price, image)
	{
		super(id);
		this.productModelId = productModelId;
		this.productOptionVariants = productOptionVariants;
		this.price = price;
		this.image = image;
	}

	addProductOptionVariant(variant)
	{
		if(!this.hasProductOptionVariant(variant))
			this.setProductOptionVariant(variant);
	}

	updateProductOptionVariant(variant)
	{
		if(this.hasProductOptionVariant(variant))
			this.setProductOptionVariant(variant);
	}

	setProductOptionVariant(variant)
	{
		this.productOptionVariants[variant.productOptionId] = variant;
	}

	hasVariant(variant)
	{
		let variants = this.productOptionVariants;
		if(variants[variant.productOptionId] === undefined || variants[variant.productOptionId] === null)
			return false;
		if(!variants[variant.productOptionId].equals(variant))
			return false;
		return true;
	}

	get productModelId()
	{
		return this._productModelId;
	}

	get productOptionVariants()
	{
		return this._productOptionVariants;
	}

	get price()
	{
		return this._price;
	}

	get image()
	{
		return this._image;
	}

	set productModelId(productModelId)
	{
		this._productModelId = productModelId;
	}

	set productOptionVariants(productOptionVariants)
	{
		this._productOptionVariants = productOptionVariants;
	}

	set price(price)
	{
		this._price = price;
	}

	set image(image)
	{
		this._image = image;
	}
}