const PATH = "public/src/main/common/util/error/InvalidOperationError.js";

import AbstractUncheckedError from "public/src/main/common/util/error/AbstractUncheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an invalid operation error.
 */
class InvalidOperationError extends AbstractUncheckedError
{
	/**
	 * Create a InvalidOperationError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {Object} error - The error.
	 */
	constructor(file, location, explanation)
	{
		super("Invalid operation.", file, location);
		this.explanation = explanation;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	toString()
	{
		if(!JsTypes.isEmpty(this.explanation))
			return super.toString() + "\nExplanation: " + this.explanation;
		else return super.toString();
	}

	/**
	 * Set the error.
	 * @param {string} [explanation] The explanation.
	 */
	set explanation(explanation)
	{
		this._explanation = explanation;
	}

	/**
	 * Get the explanation.
	 * @return The explanation.
	 */
	get explanation()
	{
		return this._explanation;
	}
}

export default InvalidOperationError;