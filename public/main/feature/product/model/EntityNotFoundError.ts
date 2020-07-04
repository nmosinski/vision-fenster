const PATH = "public/main/feature/product/model/EntityNotFoundError.js";

import AbstractCheckedError from "public/main/common/util/error/AbstractCheckedError.js"

import JsTypes from "public/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * @extends AbstractCheckedError
 * Class representing an error when a requested entity has not been found.
 */
class EntityNotFoundError extends AbstractCheckedError
{
	private _requestedEntityParameter: string;
	/**
	 * Create an EntityNotFoundError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {string} requestedEntityParameter The parameter of the requested entity.
	 */
	constructor(file: string, location: string, requestedEntityParameter: string)
	{
		super("The requested entity has not been found.", file, location);
		this.requestedEntityParameter = requestedEntityParameter;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString(): string
	{
		let ret = super.toString();
		return ret + "\nRequested entity id: " + this.requestedEntityParameter;
	}

	/**
	 * Get the requested entity parameter.
	 * @return {string} The requested entity parameter.
	 */
	get requestedEntityParameter(): string
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