import AbstractError from "./AbstractError";

const PATH = "public/main/common/util/error/AbstractUncheckedError.js";


/**
 * @class
 * Class representing an abstract unchecked error. Unchecked errors are never being catched because they can not be handled.
 */
class AbstractUncheckedError extends AbstractError
{
	/**
	 * Create an AbstractUncheckedError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
	constructor(description: string, file: string, location: string)
	{
		super(description, file, location);
	}
}

export default AbstractUncheckedError;