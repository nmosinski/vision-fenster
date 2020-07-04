const PATH = "public/main/common/util/error/VariableValueError.js";

import AbstractVariableError from "public/main/common/util/error/AbstractVariableError.js"

/**
 * @class
 * Class representing a value error of a variable.
 */
class VariableValueError extends AbstractVariableError
{
	/**
	 * Create a VariableValueError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {any} subject - The object that caused the error.
	 * @param {string} expected - A description of which value was expected.
	 */
	constructor(file: string, location: string, subject: any, expected: string)
	{
		super("Variable has an invalid value.", file, location, subject, expected);
	}
}

export default VariableValueError;