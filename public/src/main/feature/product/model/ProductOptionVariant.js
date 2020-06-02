const PATH = "public/src/main/feature/product/model/ProductOptionVariantRepository.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class ProductOptionVariantRepository extends AbstractEntity
{
	constructor(id, productOptionId, title, image=null)
	{
		super(id);
		this.productOptionId = productOptionId;
		this.title = title;
		this.image = image;
	}

	get productOptionId()
	{
		return this._productOptionId;
	}

	get title()
	{
		return this._title;
	}

	get image()
	{
		return this._image;
	}

	set productOptionId(productOptionId)
	{
		this._productOptionId = productOptionId;
	}

	set title(title)
	{
		this._title = title;
	}

	set image(image)
	{
		this._image = image;
	}
}