import AbstractVariableError from "./AbstractVariableError";

class VariableUnspecifiedError extends AbstractVariableError
{
    /**
     * Create a VariableValueError.
     * @param {string} file - The file path of the error occurance.
     * @param {string} location - A closer description of the location in the file in which the error occurred.
     * @param {any} subject - The object that caused the error.
     * @param {string} expected - A description of which value was expected.
     */
    constructor (file: string, location: string, subject: unknown, expected = 'Not unspecified.')
    {
        super("Variable is unspecified.", file, location, subject, expected);
    }
}

export default VariableUnspecifiedError;