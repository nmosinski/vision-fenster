const PATH = "public/src/main/common/util/error/AbstractError.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing an abstract error.
 */
class AbstractError
{
	/**
	 * Create an AbstractError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
	constructor(errorDescription, file, location)
	{
		this.errorDescription = errorDescription;
		this.file = file;
		this.location = location;
	}

	/**
	 * Get a string representation of this error.
	 * @return {string} The string representation.
	 */
	toString()
	{
		return "Error description: " + this.errorDescription + "\nFile: " + this.file + "\nLocation: " + this.location;
	}

	/**
	 * Set the error description.
	 * @param {string} errorDescription - The description.
	 */
	set errorDescription(errorDescription)
	{
		if(JsTypes.isString(errorDescription))
			this._errorDescription = errorDescription;
		else
			this._errorDescription = "";
	}

	/**
	 * Set the file path of where the error occurred.
	 * @param {string} file - The path to the file.
	 */
	set file(file)
	{
		if(JsTypes.isString(file))
			this._file = file;
		else
			this._file = "";
	}

	/**
	 * Set the location description of where the error occurred inside the given file.
	 * @param {string} [location] [The location of the error inside the given file.]
	 */
	set location(location)
	{
		if(JsTypes.isString(location))
			this._location = location;
		else
			this._location = "";
	}

	/**
	 * Get the error description of the error.
	 * @return {string} [The description of the error.]
	 */
	get errorDescription()
	{
		return this._errorDescription;
	}

	/**
	 * Get the file path.
	 * @return {string} [The file path of where the error occurred.]
	 */
	get file()
	{
		return this._file;
	}

	/**
	 * Get the location inside the given file of where the error occurred.
	 * @return {string} [The location.]
	 */
	get location()
	{
		return this._location;
	}
}

export default AbstractError;