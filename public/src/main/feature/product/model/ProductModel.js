const PATH = "public/src/main/feature/product/model/ProductModel.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

export default class ProductModel
{
	constructor(id, productTypeId, productCategoryId)
	{
		super(id);
		this.productTypeId = productTypeId;
		this.productCategoryId = productCategoryId;
	}

	set productTypeId(productTypeId)
	{
		this._productTypeId = productTypeId;
	}

	set productCategoryId(productCategoryId)
	{
		this._productCategoryId = productCategoryId;
	}

	get productTypeId()
	{
		return this._productTypeId;
	}

	get productCategoryId()
	{
		return this._productCategoryId;
	}
}