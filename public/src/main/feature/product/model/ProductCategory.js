const PATH = "public/src/main/feature/product/model/ProductCategory.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class ProductCategory
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