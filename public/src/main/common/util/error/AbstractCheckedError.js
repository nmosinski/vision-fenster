const PATH = "public/src/main/common/util/error/AbstractCheckedError.js";

import AbstractError from "public/src/main/common/util/error/AbstractError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an abstract unchecked error. Checked errors need to be catched and handled.
 */
class AbstractCheckedError extends AbstractError
{
	/**
	 * Create an AbstractCheckedError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
	constructor(description, file, location)
	{
		super(description, file, location);
	}
}

export default AbstractCheckedError;