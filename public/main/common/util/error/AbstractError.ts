import CONFIG from "../../../../config";
import JsTypes from "../jsTypes/JsTypes";

const PATH = "public/main/common/util/error/AbstractError.js";


/**
 * @class
 * Class representing an abstract error.
 */
class AbstractError {
	private _errorDescription: string;
	private _file: string;
	private _location: string;
	private _stack: string | undefined;

	/**
	 * Create an AbstractError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
	constructor(errorDescription: string, file: string, location: string) {
		if (CONFIG.DEBUG)
			console.trace();
		this.errorDescription = errorDescription;
		this.file = file;
		this.location = location;
		this.stack = Error().stack;
	}

	/**
	 * Get a string representation of this error.
	 * @return {string} The string representation.
	 */
	toString(): string {
		return "Error description: " + this.errorDescription + "\nFile: " + this.file + "\nLocation: " + this.location;
	}

	/**
	 * Set the file path of where the error occurred.
	 * @param {string} file - The path to the file.
	 */
	set file(file: string) {
		if (JsTypes.isString(file))
			this._file = file;
		else
			this._file = "";
	}

	/**
	 * Get the file path.
	 * @return {string} The file path of where the error occurred.
	 */
	get file(): string {
		return this._file;
	}

	set stack(stack: string | undefined) {
		this._stack = stack;
	}

	get stack(): string | undefined {
		return this._stack;
	}

	/**
	 * Get the location inside the given file of where the error occurred.
	 * @return {string} The location.
	 */
	get location(): string {
		return this._location;
	}

	/**
	 * Set the location description of where the error occurred inside the given file.
	 * @param {string} location The location of the error inside the given file.
	 */
	set location(location: string) {
		if (JsTypes.isString(location))
			this._location = location;
		else
			this._location = "";
	}

	/**
	 * Set the error description.
	 * @param {string} errorDescription - The description.
	 */
	set errorDescription(errorDescription: string) {
		if (JsTypes.isString(errorDescription))
			this._errorDescription = errorDescription;
		else
			this._errorDescription = "";
	}

	/**
	 * Get the error description of the error.
	 * @return {string} The description of the error.
	 */
	get errorDescription(): string {
		return this._errorDescription;
	}
}

export default AbstractError;