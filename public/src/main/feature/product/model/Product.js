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
		this.productOptionVariants.add(variant.productOptionId, variant);
	}

	deleteProductOptionVariantOfProductOptionId(productOptionId)
	{
		this.productOptionVariants.delete(productOptionId);
	}

	hasProductOptionVariant(variant)
	{
		if(!this.productOptionVariants.has(variant))
			return false;
		return true;
	}

	hasAnyProductOptionVariantOfProductOption(productOptionId)
	{
		if(!this.productOptionVariants.hasAny(productOptionId))
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