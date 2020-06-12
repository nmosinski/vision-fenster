const PATH = "public/src/main/feature/product/model/ProductCategory.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

class ProductCategory extends AbstractEntity
{
	constructor(id, title)
	{
		super(id);
		this.title = title;
	}

	set title(title)
	{
		this._title = title;
	}

	get title()
	{
		return this._title;
	}
}

export default ProductCategory