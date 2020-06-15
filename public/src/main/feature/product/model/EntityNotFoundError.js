const PATH = "public/src/main/feature/product/model/EntityNotFoundError.js";

import AbstractCheckedError from "public/src/main/common/util/error/AbstractCheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an error when a requested entity has not been found.
 */
class EntityNotFoundError extends AbstractCheckedError
{
	/**
	 * Create an EntityNotFoundError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {string} [requestedEntityParameter] The parameter of the requested entity.
	 */
	constructor(file, location, requestedEntityParameter)
	{
		super("The requested entity has not been found.", file, location);
		this.requestedEntityParameter = requestedEntityParameter;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString()
	{
		let ret = super.toString();
		return ret + "\nRequested entity id: " + this.requestedEntityParameter;
	}

	/**
	 * Get the requested entity parameter.
	 * @return {string} The requested entity parameter.
	 */
	get requestedEntityParameter()
	{
		return this._requestedEntityParameter;
	}

	/**
	 * Set the requested entity parameter.
	 * @param {string} requestedEntityId - The requested entity parameter.
	 */
	set requestedEntityParameter(requestedEntityParameter)
	{
		if(JsTypes.isString(requestedEntityParameter))
			this._requestedEntityParameter = requestedEntityParameter;
		else
			this._requestedEntityParameter = "";
	}
}

export default EntityNotFoundError;