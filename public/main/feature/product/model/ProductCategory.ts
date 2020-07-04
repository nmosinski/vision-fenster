const PATH = "public/main/feature/product/model/ProductCategory.js";

import AbstractModel from "public/main/common/AbstractModel.js"

/**
 * @class
 * A class representing a product category.
 */
class ProductCategory extends AbstractModel
{
	private _title: string;

	/**
	 * Create ProductCategory.
	 * @param {string} id - The id of this entity. 
	 * @param {string} title - The title of this ProductCategory.
	 */
	constructor(id: string, title: string)
	{
		super(id);
		this.title = title;
	}
	/**
	 * @param  {string} title
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

export default ProductCategory;