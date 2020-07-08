import AbstractUncheckedError from "./AbstractUncheckedError";

const PATH = "public/main/common/util/error/ForeignError.js";


/**
 * @class
 * Class representing an error thrown by foreign libraries.
 */
class ForeignError extends AbstractUncheckedError
{
	private _error: any;
	/**
	 * Create a ForeignError.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {any} error - The error.
	 */
	constructor(file: string, location: string, error: any)
	{
		super("An error was thrown by a foreign library.", file, location);
		this.error = error;
	}

	/**
	 * @inheritDoc
	 * @override
	 */
	toString(): string
	{
		return super.toString() + "\nError: " + JSON.stringify(this.error);
	}

	/**
	 * Set the error.
	 * @param {any} error The error.
	 */
	set error(error: any)
	{
		this._error = error;
	}

	/**
	 * Get the error.
	 * @return {any} The error.
	 */
	get error(): any
	{
		return this._error;
	}
}

export default ForeignError;