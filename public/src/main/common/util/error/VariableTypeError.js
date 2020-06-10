const PATH = "public/src/main/common/util/error/VariableTypeError.js";

import AbstractVariableError from "public/src/main/common/util/error/AbstractVariableError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

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
	 * @param {Object} subject - The object that caused the error.
	 * @param {string} expected - A description of which type was expected.
	 */
	constructor(file, location, subject, expected)
	{
		super("Variable is of a wrong type.", file, location, subject);
		this.expected = expected;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString()
	{
		let ret = super.toString();
		
		if(!JsTypes.isEmpty(this.expected))
			ret += "\nExpected: " + this.expected;

		return ret;
	}

	/**
	 * Set the description of the expected type.
	 * @param {string} [type] The expected type.
	 */
	set expected(expected)
	{
		if(JsTypes.isString(expected))
			this._expected = expected;
		else
			this._expected = "";
	}

	/**
	 * Get the description of the expected type.
	 * @return {string} The description of the expected type.
	 */
	get expected()
	{
		return this._expected;
	}

}

export default VariableTypeError;