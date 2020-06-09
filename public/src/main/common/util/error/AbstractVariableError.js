const PATH = "public/src/main/common/util/error/AbstractVariableError.js";

import AbstractError from "public/src/main/common/util/error/AbstractError.js"

/**
 * @class
 * Class representing an abstract error with a variable.
 */
class AbstractVariableError extends AbstractError
{
	/**
	 * Create an AbstractVariableError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {Object} subject - The object that caused the error.
	 */
	constructor(description, file, location, subject)
	{
		super(description, file, location);
		this.subject = subject;
	}

	/**
	 * Set the object that caused the error.
	 * @param {?} [subject] [The object that caused the error.]
	 */
	set subject(subject)
	{
		this._subject = subject;
	}

	/**
	 * Get the object that caused the error.
	 * @return The object that caused the error.
	 */
	get subject()
	{
		return this._subject;
	}
}

export default AbstractVariableError;