const PATH = "public/src/main/common/wixData/ItemNotFoundError.js";

import AbstractCheckedError from "public/src/main/common/util/error/AbstractCheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an error when a requested item has not been found.
 */
class ItemNotFoundError extends AbstractCheckedError
{
	/**
	 * Create an ItemNotFoundError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {string} [requestedItemParameter] The parameter of the requested item.
	 */
	constructor(file, location, requestedItemParameter)
	{
		super("The requested entity has not been found.", file, location);
		this.requestedItemParameter = requestedItemParameter;
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
	 * Get the requested item parameter.
	 * @return {string} The requested item parameter.
	 */
	get requestedItemParameter()
	{
		return this._requestedItemParameter;
	}

	/**
	 * Set the requested item parameter.
	 * @param {string} requestedItemParameter - The requested item parameter.
	 */
	set requestedItemParameter(requestedItemParameter)
	{
		if(JsTypes.isString(requestedItemParameter))
			this._requestedItemParameter = requestedItemParameter;
		else
			this._requestedItemParameter = "";
	}
}

export default ItemNotFoundError;