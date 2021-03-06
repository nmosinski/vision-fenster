import AbstractVariableError from "./AbstractVariableError";

const PATH = "public/main/common/util/error/VariableTypeError.js";


/**
 * @class
 * Class representing a type error of a variable.
 */
class VariableTypeError extends AbstractVariableError
{
	/**
	 * Create a VariableTypeError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {any} subject - The object that caused the error.
	 * @param {string} expected - A description of which type was expected.
	 */
	constructor(file: string, location: string, subject: any, expected: string)
	{
		super("Variable is of a wrong type.", file, location, subject, expected);
	}
}

export default VariableTypeError;