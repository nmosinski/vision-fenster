import AbstractUncheckedError from "./AbstractUncheckedError";
import JsTypes from "../jsTypes/JsTypes";

const PATH = "public/main/common/util/error/AbstractVariableError.js";


/**
 * @class
 * @extends AbstractUncheckedError
 * Class representing an abstract error with a variable.
 */
class AbstractVariableError extends AbstractUncheckedError
{
	private _subject: any;
	private _expected: string;
	/**
	 * Create an AbstractVariableError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 * @param {any} subject - The object that caused the error.
	 * @param {string} expected - A description of what was expected.
	 */
	constructor(description: string, file: string, location: string, subject: any, expected: string)
	{
		super(description, file, location);
		this.subject = subject;
		this.expected = expected;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	toString(): string
	{
		let ret = super.toString();
		
		ret += "\n" + JSON.stringify(this.subject);

		ret += "\nExpected: " + this.expected;

		return ret;
	}

	/**
	 * Set the object that caused the error.
	 * @param {any} subject The object that caused the error.
	 */
	set subject(subject: any)
	{
		this._subject = subject;
	}

	/**
	 * Get the object that caused the error.
	 * @return {any} The object that caused the error.
	 */
	get subject(): any
	{
		return this._subject;
	}

	/**
	 * Set the description of what was expected.
	 * @param {string} expected The description.
	 */
	set expected(expected: string)
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
	get expected(): string
	{
		return this._expected;
	}
}

export default AbstractVariableError;