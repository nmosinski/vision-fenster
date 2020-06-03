const PATH = "public/src/main/feature/product/model/Product.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

class Product extends AbstractEntity
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

	deleteProductOptionVariantOfProductOptionId(productOptionId)
	{
		delete this.productOptionVariants.productOptionId;
	}

	hasProductOptionVariant(variant)
	{
		if(!this.hasAnyProductOptionVariantOfProductOption(variant.productOptionId))
			return false;
		if(!this.productOptionVariants[variant.productOptionId].equals(variant))
			return false;
		return true;
	}

	hasAnyProductOptionVariantOfProductOption(productOptionId)
	{
		let variant = this.productOptionVariants[productOptionId];
		if(variant === undefined || variant === null)
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

export default Product