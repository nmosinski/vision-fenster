const PATH = "public/src/main/feature/product/model/ProductOptionVariant.js";

import AbstractEntity from "public/src/main/common/AbstractEntity.js"
import IComparable from "public/src/main/common/util/IComparable.js"
import IClonable from "public/src/main/common/util/IClonable.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * A class representing a variant of a product option.
 */
class ProductOptionVariant extends AbstractEntity implements IComparable<ProductOptionVariant>, IClonable<ProductOptionVariant>
{
	private _productOptionTypeId: string;
	private _title: string;
	private _image: string;
	/**
	 * Create ProductOptionVariant
	 * @param {string} id The id of this entity.
	 * @param {string} productOptionTypeId The id of the productOptionType.
	 * @param {string} title The title.
	 * @param {string | null} image Link to the image that represents this object visually or null, if doesn't exist.
	 */
	constructor(id: string, productOptionTypeId: string, title: string, image: string | null=null)
	{
		super(id);
		this.productOptionTypeId = productOptionTypeId;
		this.title = title;
		this.image = image;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	equals(object: ProductOptionVariant): boolean
	{
		if(! (object instanceof ProductOptionVariant))
			return false;
		
		if(this._id !== object.id)
			return false;

		if(this._productOptionTypeId !== object.productOptionTypeId)
			return false;

		if(this._title !== object.title)
			return false;

		if(this._image !== object.image)
			return false;
		return true;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	clone(): ProductOptionVariant
	{
		return new ProductOptionVariant(this.id, this.productOptionTypeId, this.title, this.image);
	}

	/**
	 * Get productOptionTypeId.
	 * @return {string} The id of the product option type this variant belongs to.
	 */
	get productOptionTypeId(): string
	{
		return this._productOptionTypeId;
	}

	/**
	 * Get title.
	 * @return {string} The title of this variant.
	 */
	get title(): string
	{
		return this._title;
	}

	/**
	 * Get image.
	 * @return {string} The link to the image.
	 */
	get image(): string
	{
		return this._image;
	}

	/**
	 * Set productOptionTypeId.
	 * @param {string} productOptionTypeId The id of the product option type to which this variant belongs.
	 */
	set productOptionTypeId(productOptionTypeId: string)
	{
		if(!JsTypes.isString(productOptionTypeId))
			throw new VariableTypeError(PATH, "ProductOptionVariant.set productOptionTypeId()", productOptionTypeId, "string");
		if(JsTypes.isEmpty(productOptionTypeId))
			throw new VariableValueError(PATH, "ProductOptionVariant.set productOptionTypeId()", productOptionTypeId, "Not empty string");
		this._productOptionTypeId = productOptionTypeId;
	}

	/**
	 * Set title.
	 * @param {string} title The title.
	 */
	set title(title: string)
	{
		if(!JsTypes.isString(title))
			throw new VariableTypeError(PATH, "ProductOptionVariant.set title()", title, "string");
		if(JsTypes.isEmpty(title))
			throw new VariableValueError(PATH, "ProductOptionVariant.set title()", title, "Not empty string");
		this._title = title;
	}

	/**
	 * Set image.
	 * @param {string} image The image.
	 */
	set image(image: string)
	{
		if(JsTypes.isString(image))
		{
			if(!JsTypes.isEmpty(image))
				this._image = image;
			else
				throw new VariableValueError(PATH, "ProductOptionVariant.set image()", image, "Not empty string or empty");
		}
		else if(JsTypes.isUnspecified(image))
		{
				this._image = image;
		}
		else
			throw new VariableTypeError(PATH, "ProductOptionVariant.set image()", image, "string | empty");

	}
}

export default ProductOptionVariant;