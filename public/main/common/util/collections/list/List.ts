import IComparable from "../../IComparable";
import JsTypes from "../../jsTypes/JsTypes";
import VariableTypeError from "../../error/VariableTypeError";
import InvalidOperationError from "../../error/InvalidOperationError";
import VariableValueError from "../../error/VariableValueError";
import NullPointerException from "../../error/NullPointerException";
import { AnyNumber } from "../../supportive";

const PATH = "public/main/common/util/list/List.js";

/**
 * @class
 * Class representing a List.
 */
class List<T> implements IComparable
{
	protected _elements: T[];
	/**
	 * Create a List.
	 * @param {Array<T>} [elements=Array<T>] - An array of elements that the list will contain from the beginning.
	 */
	constructor (elements: AnyNumber<T> = [])
	{
		this._elements = [];
		let toInsert: T[] = [];

		if (elements instanceof List)
			toInsert = elements.toArray();
		else if (Array.isArray(elements))
			toInsert = elements;
		else if (JsTypes.isUnspecified(elements))
			toInsert = [];
		else
			toInsert.push(elements);

		for (const idx in toInsert)
			this.add(toInsert[idx]);
	}

	/**
	 * Return a new list containing only those items that are in this list and the one passed as argument.
	 * @param {List<T>} list - The other list.
	 * @return {List<T>} A new List containing items that are in both lists.
	 */
	AND(list: List<T>): List<T>
	{
		if (!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List<T>");

		return this.filter((el: T) => { return list.has(el); });
	}

	/**
	 * Return a new list containing all items that are in this list or the one passed as argument.
	 * @param {List<T>} list - The other list.
	 * @return {List<T>} A new List containing all items from both lists.
	 */
	WITH(list: List<T>): List<T>
	{
		if (!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List");

		const l = new List(this.toArray());

		list.foreach((el: T) =>
		{
			if (!l.has(el))
				l.add(el);
		});

		return l;
	}

	WITHOUT(list: List<T>): List<T>
	{
		return this.filter(el => list.hasNot(el));
	}

	/**
	 * Check if two elements are equal.
	 * @param e1 The element to be compared to e2.
	 * @param e2 The element to be compared to e1.
	 * @returns {boolean} True if elements are equal, else false.
	 */
	protected elementsEqual(e1: any, e2: any): boolean
	{
		try
		{
			// @ts-ignore
			if (e1.equals(e2))
				return true;
		}
		catch
		{
			if (e1 === e2)
				return true;
		}

		return false;
	}

	/**
	 * Iterate through all elements of this list and calls the passed async function.
	 * @param {Function} f - The function to be called by each element of this list.
	 * @returns {Promise<this>} This.
	 */
	async foreachAsync(f: (el: T, idx?: number) => Promise<void>): Promise<this>
	{
		if (!JsTypes.isFunction(f))
			throw new VariableTypeError(PATH, "List.foreachAsync(f)", f, "function");

		for (let idx = 0; idx < this.length; idx++)
			await f(this.get(idx), idx);

		return this;
	}

	/**
	 * Iterate through all elements of this list and calls the passed function.
	 * @param {Function} f - The function to be called by each element of this list.
	 * @returns {this} This.
	 */
	foreach(f: (el: T, idx?: number) => void): this
	{
		if (!JsTypes.isFunction(f))
			throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

		for (let idx = 0; idx < this.length; idx++)
			f(this.get(idx), idx);

		return this;
	}

	/**
	 * Iterate through all elements of this list and calls the mapping function which returns the mapped element.
	 * @param {Function} f - The mapping function to be called by each element of this list.
	 * @returns {List<U>} A list containing the mapped elements.
	 */
	map<U>(f: (el: T, idx?: number) => U): List<U>
	{
		if (!JsTypes.isFunction(f))
			throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

		const mappedElements = new List<U>();
		for (let idx = 0; idx < this.length; idx++)
			mappedElements.add(f(this.get(idx), idx));

		return mappedElements;
	}

	/**
	 * Filters all elements of this list by the given expression and returns a new list with the elements that match.
	 * @param {Function} f A function representing the filtering expression.
	 * @return {List} A new list with the filtered elements.
	 */
	filter(f: (el: T) => boolean): List<T>
	{
		if (!JsTypes.isFunction(f))
			throw new VariableTypeError(PATH, "List.filter(f)", f, "function");

		const ret = new List<T>();

		this.foreach((el) =>
		{
			if (f(el))
				ret.add(el);
		});

		return ret;
	}

	/**
	 * Pluck the given property from all elements of the list and return a new list containing only the given property.
	 * @param {any} propertyName The name of the property the elements in the list will be reduced to.
	 * @returns {List<any>} A new list containig the reduced element.
	 */
	pluck(propertyName: string): List<any>
	{
		const plucked = new List<any>();

		this.foreach((t) => plucked.add(t[propertyName]));

		return plucked;
	}

	/**
	 * Return a new list containing only items in the given range.
	 * @param {number} startIndex The start index from which items will be returned.
	 * @param {number} [endIndex=null] The end index until which the items will be returned.
	 * @return {List<T>} The sublist.
	 */
	sublist(startIndex: number, endIndex?: number): List<T>
	{
		const list = new List<T>();

		if (startIndex >= this.length)
			throw new InvalidOperationError(PATH, "List.sublist()", "StartIndex is bigger than the length of this list.");

		if (!endIndex)
			endIndex = this.length - 1;

		for (let idx = startIndex; idx <= endIndex; idx++)
			list.add(this.get(idx));

		return list;
	}

	/**
	 * Check if another list equals this list.
	 * @override
	 * @inheritdoc
	 */
	equals(object: any): boolean
	{
		if (!(object instanceof List))
			return false;

		for (let idx = 0; idx < object.length; idx++)
			if (!this.has(object.get(idx)))
				return false;

		if (!(this.length === object.length))
			return false;

		return true;
	}

	/**
	 * Check if this list is a sublist of the given one.
	 * @param {List<any>} list The list to be checked on.
	 * @returns {boolean} True if this list is a sublist of the given one, else false.
	 */
	isSublistOf(list: List<any>): boolean
	{
		let ret = true;

		this.foreach((el) =>
		{
			if (!list.has(el))
				ret = false;
		});

		return ret;
	}

	/**
	 * Get all elements of this list as array.
	 * @return {Array<T>} The elements.
	 */
	toArray(): T[]
	{
		const ret: T[] = [];

		for (const idx in this._elements)
			ret.push(this._elements[idx]);

		return ret;
	}

	/**
	 * Get a number of items.
	 * @param {number} [count] The maximum count of items to be returned.
	 * @returns {List<T>} A list containing items. 
	 */
	some(count?: number): List<T>
	{
		if (!count)
			count = this.length;
		return this.sublist(0, count);
	}

	/**
	 * Get the first item.
	 * @returns {T} The item.
	 * @throws {NullPointerException} If list is empty.
	 */
	first(): T | never
	{
		if (this.length < 1)
			throw new NullPointerException(PATH, "first", "The list is empty");
		return this.get(0);
	}

	/**
	 * Get the first item or return null, if the first is empty.
	 * @returns {T} The item.
	 */
	firstOrNull(): T | null
	{
		if (this.length < 1)
			return null;
		return this.get(0);
	}

	/**
	 * Get the last item.
	 * @returns {T} The item.
	 * @throws {NullPointerException} If list is empty.
	 */
	last(): T | never
	{
		if (this.length < 1)
			throw new NullPointerException(PATH, "first", "The list is empty");

		return this.get(this.length - 1);
	}

	/**
	 * Add elements.
	 * @param {...T} elements - The elements.
	 */
	add(...elements: T[]): this
	{
		return this.addMultiple(elements);
	}

	/**
	 * Add elements.
	 * @param {Array<T>} elements - The elements.
	 */
	addMultiple(elements: T[]): this
	{
		// tslint:disable-next-line: prefer-for-of
		for (let idx = 0; idx < elements.length; idx++)
			this._elements.push(elements[idx]);
		return this;
	}

	/**
	 * Get the element at the given index.
	 * @param {number} elementIdx - The index.
	 * @return {T} The element.
	 */
	get(elementIdx: number): T | never
	{
		if (!JsTypes.isNumber(elementIdx))
			throw new VariableTypeError(PATH, "List.get(elementIdx)", elementIdx, "Number");

		if (elementIdx < 0 || elementIdx >= this.length)
			throw new VariableValueError(PATH, "List.get(elementIdx)", elementIdx, "-1<x<" + this.length);

		return this._elements[elementIdx];
	}

	/**
	 * Remove the element at the given index.
	 * @param {number} elementIdx - The index.
	 */
	remove(elementIdx: number): this | never
	{
		if (!JsTypes.isNumber(elementIdx))
			throw new VariableTypeError(PATH, "List.remove(elementIdx)", elementIdx, "Number");

		if (elementIdx < 0 || elementIdx >= this.length)
			throw new VariableValueError(PATH, "List.remove(elementIdx)", elementIdx, "-1<x<" + this.length);

		this._elements.splice(elementIdx, 1);
		return this;
	}

	/**
	 * Check if list contains element.
	 * @param {any} element - The element.
	 * @param {Function} [matchingFunction] The function that defines how the elements match.
	 * @return {boolean} True if element is in the list, else false.
	 */
	has(element: any): boolean
	{
		if (this.indexOf(element) === -1)
			return false;
		return true;
	}

	/**
	 * Returns the first element that matches the given filter
	 * @param {Function} f: The filter.
	 * @return {T} The found element. 
	 * @throws {NullPointerException} If list is empty.
	 */
	find(f: (el: T) => boolean): T
	{
		return this.filter(f).first();
	}

	/**
	 * Returns the first element that matches the given filter or null if there were no matches.
	 * @param {Function} f: The filter.
	 * @return {T|null} The found element or null if not found. 
	 */
	findOrNull(f: (el: T) => boolean): T | null
	{
		try
		{
			return this.find(f);
		}
		catch (err)
		{
			return null;
		}
	}

	/**
	 * Check if list does not contain element.
	 * @param {any} element - The element.
	 * @param {Function} [matchingFunction] The function that defines how the elements match.
	 * @return {boolean} True if element is not in the list, else false.
	 */
	hasNot(element: any): boolean
	{
		return !this.has(element);
	}

	/**
	 * Get the index of the given element.
	 * @param {any} element - The element.
	 * @return {number} The index of the element, else -1, if the element is not in the list. 
	 */
	indexOf(element: any): number
	{
		for (let idx = 0; idx < this.length; idx++)
		{
			if (this.elementsEqual(this.get(idx), element))
				return idx;
		}
		return -1;
	}

	/**
	 * Create a copy of this list. If T implements clonable, create a deep copy, else a shallow copy.
	 */
	copy(): List<T>
	{
		const l = new List<T>();

		this.foreach((el: T) =>
		{
			try
			{
				// @ts-ignore
				l.add(el.clone());
			}
			catch (err)
			{
				l.add(el);
			}
			;
		})

		return l;
	}

	/**
	 * Check if list is empty.
	 * @return {boolean} True if empty, else false.
	 */
	isEmpty(): boolean
	{
		return this.length === 0;
	}

	/**
	 * @param {Array<T>} elements
	 */
	private set elements(elements: T[])
	{
		this._elements = elements;
	}


	/**
	 * Get lenth of this list.
	 * @returns {number} The length of this list.
	 */
	get length(): number
	{
		return this._elements.length;
	}
}

export default List;