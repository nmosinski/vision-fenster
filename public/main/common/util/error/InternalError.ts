import AbstractUncheckedError from "./AbstractUncheckedError";

const PATH = "public/main/common/util/error/InternalError.js";


/**
 * @class
 * Class representing an internal error. Internal errors stand for intern logic errors and shouldn't happen in any case.
 */
class InternalError extends AbstractUncheckedError {
	/**
	 * Create an InternalError.
	 * @param {string} errorDescription - The description of the error.
	 * @param {string} file - The file path of the error occurance.
	 * @param {string} location - A closer description of the location in the file in which the error occurred.
	 */
    constructor(description: string, file: string, location: string) {
        super(description, file, location);
    }
}

export default InternalError;