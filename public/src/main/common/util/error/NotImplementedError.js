const PATH = "public/src/main/common/util/error/NotImplementedError.js";

import AbstractError from "public/src/main/common/util/error/AbstractError.js"

/**
 * @class
 * Class representing an error that occurrs if a method has not been implemented.
 */
class NotImplementedError extends AbstractError
{
	/**
	 * Create a NotImplementedError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
	constructor(file, location)
	{
		super("The method is abstract and has not been overwritten by any child class.", file, location);
	}
}

export default NotImplementedError;