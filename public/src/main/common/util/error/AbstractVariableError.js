const PATH = "public/src/main/common/util/error/AbstractVariableError.js";

import AbstractUncheckedError from "public/src/main/common/util/error/AbstractUncheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an abstract error with a variable.
 */
class AbstractVariableError extends AbstractUncheckedError
{
	/**
	 * Create an AbstractVariableError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {Object} subject - The object that caused the error.
	 * @param {string} expected - A description of what was expected.
	 */
	constructor(description, file, location, subject, expected)
	{
		super(description, file, location);
		this.subject = subject;
		this.expected = expected;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString()
	{
		let ret = super.toString();
		
		ret += "\n" + JSON.stringify(this.subject);

		ret += "\nExpected: " + this.expected;

		return ret;
	}

	/**
	 * Set the object that caused the error.
	 * @param {?} [subject] The object that caused the error.
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

	/**
	 * Set the description of what was expected.
	 * @param {string} [expected] The description.
	 */
	set expected(expected)
	{
		if(JsTypes.isString(expected))
			this._expected = expected;
		else
			this._expected = "";
	}

	/**
	 * Get the description of what was expected.
	 * @return {string} The description of what was expected.
	 */
	get expected()
	{
		return this._expected;
	}
}

export default AbstractVariableError;