import AbstractUncheckedError from "./AbstractUncheckedError";

const PATH = "public/main/common/util/error/InvalidOperationError.js";


/**
 * @class
 * Class representing an invalid operation error.
 */
class InvalidOperationError extends AbstractUncheckedError
{
	private _explanation: string;
	/**
	 * Create a InvalidOperationError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {string} explanation - The explanation.
	 */
	constructor(file: string, location: string, explanation: string)
	{
		super("Invalid operation.", file, location);
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
	 * Set the error.
	 * @param {string} explanation The explanation.
	 */
	set explanation(explanation: string)
	{
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

export default InvalidOperationError;