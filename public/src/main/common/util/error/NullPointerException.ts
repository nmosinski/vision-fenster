const PATH = "public/src/main/common/util/error/NullPointerException.js";

import AbstractUncheckedError from "public/src/main/common/util/error/AbstractUncheckedError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an error caused by an unexpected null pointer.
 */
class NullPointerException extends AbstractUncheckedError
{
	private _explanation: string;
	/**
	 * Create a NullPointerException.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {string} explanation - The explanation.
	 */
	constructor(file: string, location: string, explanation: string)
	{
		super("Unexpected null pointer.", file, location);
		this.explanation = explanation;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	toString(): string
	{
		return super.toString() + "\nExplanation: " + this.explanation;
	}

	/**
	 * Set the explanation.
	 * @param {string} explanation The explanation.
	 */
	set explanation(explanation: string)
	{
		if(JsTypes.isString(explanation))
			this._explanation = explanation;
		else
			this._explanation = explanation;
	}

	/**
	 * Get the explanation.
	 * @return {string} The explanation.
	 */
	get explanation(): string
	{
		return this._explanation;
	}
}

export default NullPointerException;