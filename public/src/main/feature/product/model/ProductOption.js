const PATH = "public/src/main/feature/product/model/ProductOption.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"

export default class ProductOption extends IComparable(AbstractEntity)
{
	constructor(id, productModelId, type, variants)
	{
		super(id);
		this.productModelId = productModelId;
		this.type = type;
		this.variants = variants;
	}

	get productModelId()
	{
		return this._productModelId;
	}

	get type()
	{
		return this._type;
	}

	get variants()
	{
		return this._variants;
	}

	set productModelId(id)
	{
		this._productModelId = id;
	}

	set type(type)
	{
		this._type = type;
	}

	set variants(variants)
	{
		this._variants = variants;
	}
}