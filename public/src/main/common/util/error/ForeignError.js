const PATH = "public/src/main/common/util/error/ForeignError.js";

import AbstractUncheckedError from "public/src/main/common/util/error/AbstractUncheckedError.js"

/**
 * @class
 * Class representing an error thrown by foreign libraries.
 */
class ForeignError extends AbstractUncheckedError
{
	/**
	 * Create a ForeignError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {Object} error - The error.
	 */
	constructor(file, location, error)
	{
		super("An error was thrown by a foreign library.", file, location);
		this.error = error;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	toString()
	{
		return super.toString() + "\nError: " + JSON.stringify(this.error);
	}

	/**
	 * Set the error.
	 * @param {?} [error] The error.
	 */
	set error(error)
	{
		this._error = error;
	}

	/**
	 * Get the error.
	 * @return The error.
	 */
	get error()
	{
		return this._error;
	}
}

export default ForeignError;