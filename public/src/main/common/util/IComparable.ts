/**
 * @alias IComparable
 * @interface
 * Marks an object as comparable.
 */
interface IComparable<T>
{
	/**
	 * Compares an object to this object checking for equality.
	 * @param  {T} object - The object this object will be compared to.
	 * @return {boolean} True if objects are equal, else false.
	 * @abstract
	 */
	equals(object: T): boolean;
}

export default IComparable;