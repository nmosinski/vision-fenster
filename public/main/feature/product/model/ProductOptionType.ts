const PATH = "public/src/main/feature/product/model/ProductOptionType.js";

import AbstractModel from "public/src/main/common/AbstractModel.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a type of an option of a product.
 */
class ProductOptionType extends AbstractModel implements IComparable<ProductOptionType>, IClonable<ProductOptionType>
{
	private _productModelId: string;
	private _title: string;
	/**
	 * Create ProductOptionType.
	 * @param {string} id The id of this entity.
	 * @param {string} productModelId The id of the product model this product option belongs to.
	 * @param {string} title The title of this product option type.
	 */
	constructor(id: string, productModelId: string, title: string)
	{
		super(id);
		this.productModelId = productModelId;
		this.title = title;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(o: ProductOptionType): boolean
	{
		if(! (o instanceof ProductOptionType))
			return false;
			
		if(!(this._id === o.id))
			return false;
		if(!(this._productModelId === o.productModelId))
			return false;
		if(!(this._title === o.title))
			return false;
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	clone(): ProductOptionType
	{
		return new ProductOptionType(this.id, this.productModelId, this.title);
	}

	/**
	 * Get productModelId.
	 * @return {string} The id of the product model.
	 */
	get productModelId(): string
	{
		return this._productModelId;
	}

	/**
	 * Get title.
	 * @return {string} The title.
	 */
	get title(): string
	{
		return this._title;
	}

	/**
	 * Set productModelId.
	 * @param {string} id The id of the product model this product option belongs to.
	 */
	set productModelId(id: string)
	{
		if(!JsTypes.isString(id))
			throw new VariableTypeError(PATH, "ProductOptionType.set productModelId()", id, "string");
		if(JsTypes.isEmpty(id))
			throw new VariableValueError(PATH, "ProductOptionType.set productModelId()", id, "Not empty string");
		this._productModelId = id;
	}

	/**
	 * Set title.
	 * @param {string} title The title.
	 */
	set title(title: string)
	{
		if(!JsTypes.isString(title))
			throw new VariableTypeError(PATH, "ProductOptionType.set title()", title, "string");
		if(JsTypes.isEmpty(title))
			throw new VariableValueError(PATH, "ProductOptionType.set title()", title, "Not empty string");
		this._title = title;
	}
}

export default ProductOptionType;