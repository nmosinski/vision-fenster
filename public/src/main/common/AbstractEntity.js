const PATH = "public/src/main/common/AbstractEntity.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"
import InvalidOperationError from "public/src/main/common/util/error/InvalidOperationError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * A class representing an abstract entity.
 */
class AbstractEntity
{
	/**
	 * Create AbstractEntity.
	 * @param {string} id - The id of this entity. 
	 */
	constructor(id)
	{
		this.id = id;
	}

	/**
	 * Get id.
	 * @return {string} The id of this entity.
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Set id.
	 * @param {string} id - The id of this entity.
	 */
	set id(id)
	{
		if(!JsTypes.isEmpty(this._id))
			throw new InvalidOperationError(PATH, "AbstractEntity.set id()", "Id of an entity can not be redefined.");
		if(!JsTypes.isString(id))
			throw new VariableTypeError(PATH, "AbstractEntity.set id()", id, "string");
		if(JsTypes.isEmpty(id))
			throw new VariableValueError(PATH, "AbstractEntity.set id()", id, "a not empty string");

		this._id = id;
	}
}

export default AbstractEntity