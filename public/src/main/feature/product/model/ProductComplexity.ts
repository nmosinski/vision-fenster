const PATH = "public/src/main/feature/product/model/ProductComplexity.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"

class ProductComplexity extends AbstractEntity
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