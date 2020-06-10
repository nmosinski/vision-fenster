const PATH = "public/src/main/common/util/error/VariableValueError.js";

import AbstractVariableError from "public/src/main/common/util/error/AbstractVariableError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

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
	 * @param {Object} subject - The object that caused the error.
	 * @param {string} expected - A description of which value was expected.
	 */
	constructor(file, location, subject, expected)
	{
		super("Variable has an invalid value.", file, location, subject);
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
	 * Set the description of the expected value.
	 * @param {string} [type] [The expected value.]
	 */
	set expected(expected)
	{
		if(JsTypes.isString(expected))
			this._expected = expected;
		else
			this._expected = "";
	}

	/**
	 * Get the description of the expected value.
	 * @return {string} [The description of the expected value.]
	 */
	get expected()
	{
		return this._expected;
	}

}

export default VariableValueError;