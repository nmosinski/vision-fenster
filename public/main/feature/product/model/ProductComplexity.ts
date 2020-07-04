const PATH = "public/main/feature/product/model/ProductComplexity.js";

import AbstractModel from "public/main/common/AbstractModel.js"

class ProductComplexity extends AbstractModel
{
	private _title: string;

	constructor(id: string, title: string)
	{
		super(id);
		this.title = title;
	}
	/**
	 * @param {string} title
	 */
	set title(title: string)
	{
		this._title = title;
	}

	
	/**
	 * @returns {string}
	 */
	get title(): string
	{
		return this._title;
	}
}

export default ProductComplexity;