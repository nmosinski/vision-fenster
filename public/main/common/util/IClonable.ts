/**
 * @alias IClonable
 * @interface
 * Marks an object as clonable.
 */
interface IClonable<T>
{
	/**
	 * Clones this object.
	 * @return {T} A copy of this object.
	 * @abstract
	 */
	clone(): T;
}

export default IClonable;