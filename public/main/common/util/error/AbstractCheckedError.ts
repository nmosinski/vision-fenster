import AbstractError from "./AbstractError";

const PATH = "public/main/common/util/error/AbstractCheckedError.js";


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
	constructor(description: string, file: string, location: string)
	{
		super(description, file, location);
	}
}

export default AbstractCheckedError;