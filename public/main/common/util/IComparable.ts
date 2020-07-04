/**
 * @alias IComparable
 * @interface
 * Marks an object as comparable.
 */
interface IComparable
{
	/**
	 * Compares an object to this object checking for equality.
	 * @param  {any} object - The object this object will be compared to.
	 * @return {boolean} True if objects are equal, else false.
	 * @abstract
	 */
	equals(object: object): boolean;
}

export default IComparable;