const PATH = "public/src/main/feature/product/model/ProductOptionVariant.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"

export default class ProductOptionVariant extends IComparable(AbstractEntity)
{
	constructor(id, productOptionId, title, image=null)
	{
		super(id);
		this.productOptionId = productOptionId;
		this.title = title;
		this.image = image;
	}

	/**
	 * @override
	 */
	equals(object)
	{
		if(! (object instanceof ProductOptionVariant))
			return false;
		
		if(this.id !== object.id)
			return false;

		if(this.productOptionId !== object.productOptionId)
			return false;

		if(this.title !== object.title)
			return false;

		if(this.image !== object.image)
			return false;
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