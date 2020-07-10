import IComparable from "../../IComparable";
import JsTypes from "../../jsTypes/JsTypes";
import VariableTypeError from "../../error/VariableTypeError";
import InvalidOperationError from "../../error/InvalidOperationError";
import VariableValueError from "../../error/VariableValueError";

const PATH = "public/main/common/util/list/List.js";

/**
 * @class
 * Class representing a List.
 */
class List<T> implements IComparable
{
	protected _elements: Array<T>;
	/**
	 * Create a List.
	 * @param {Array<T>} [elements=Array<T>] - An array of elements that the list will contain from the beginning.
	 */
	constructor(elements: Array<T>=[])
	{
		this._elements = [];

		if(JsTypes.isArray(elements))
			for(let idx in elements)
				this.add(elements[idx]);
	}

	/**
	 * Return a new list containing only those items that are in this list and the one passed as argument.
	 * @param {List<T>} list - The other list.
	 * @return {List<T>} A new List containing items that are in both lists.
	 */
	AND(list: List<T>): List<T>
	{
		if(!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List<T>");
		
		return this.filter((el:T)=>{return list.has(el);});
	}

	/**
	 * Return a new list containing all items that are in this list or the one passed as argument.
	 * @param {List<T>} list - The other list.
	 * @return {List<T>} A new List containing all items from both lists.
	 */
	OR(list: List<T>): List<T>
	{
		if(!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List");
		
		let l = new List(this.toArray());

		list.foreach((el: T) => {
			if(!l.has(el))
				l.add(el);
		});
		return l;
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
			//@ts-ignore
			if(e1.equals(e2))
				return true;
		}
		catch
		{
			if(e1 === e2)
				return true;
		}
	}

	/**
	 * Iterate through all elements of this list and calls the passed async function.
	 * @param {Function} f - The function to be called by each element of this list.
	 */
    async foreachAsync(f: (el: T) => void): Promise<void>
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreachAsync(f)", f, "function");

        for(let idx = 0; idx < this.length; idx++)
            await f(this.get(idx));
	}

	/**
	 * Iterate through all elements of this list and calls the passed function.
	 * @param {Function} f - The function to be called by each element of this list.
	 */
    foreach(f: (el: T) => void): void
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

        for(let idx = 0; idx < this.length; idx++)
            f(this.get(idx));
	}

    /**
     * Filters all elements of this list by the given expression and returns a new list with the elements that match.
     * @param {Function} f A function representing the filtering expression.
     * @return {List} A new list with the filtered elements.
     */
    filter(f: (el: T) => boolean): List<T>
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.filter(f)", f, "function");

    	let ret = [];

    	for(let idx = 0; idx < this.length; idx++)
        {
        	let el = this.get(idx);
        	if(f(el))
            	ret.push(el);
		}

		return new List(ret);
	}

	/**
	 * Splits a property from the elements of the list and returns a new list containing the given property of each element in the list.
	 * @param propertyName The name of the property to be splitted.
	 * @returns {List<U>} A new list containig the given property of each element in the list.
	 */
	splitProperty<U>(propertyName): List<U>
	{
		let us = new List<U>();

		this.foreach((t)=>{us.add(t[propertyName]);});

		return us;
	}
	
	/**
	 * Return a new list containing only items in the given range.
	 * @param {number} startIndex The start index from which items will be returned.
	 * @param {number} [endIndex=null] The end index until which the items will be returned.
	 * @return {List<T>} The sublist.
	 */
	sublist(startIndex: number, endIndex: number=null): List<T>
	{
		let list = new List<T>();
		
		if(startIndex >= this.length)
			throw new InvalidOperationError(PATH, "List.sublist()", "StartIndex is bigger than the length of this list.");
		
		if(!endIndex)
			endIndex = this.length-1;
		
		for(let idx=startIndex; idx <= endIndex; idx++)
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
		if(!(object instanceof List))
			return false;
		
		for(let idx = 0; idx < object.length; idx++)
			if(!this.has(object.get(idx)))
				return false;
		
		if(!(this.length === object.length))
			return false;

		return true;
	}

	/**
	 * Get all elements of this list as array.
	 * @return {Array<T>} The elements.
	 */
    toArray(): Array<T>
    {
    	let ret = [];

    	for(let idx in this._elements)
    		ret.push(this._elements[idx]);

    	return ret;
	}
	
	/**
     * Get a number of items.
     * @param {number} [count=null] The maximum count of items to be returned.
     * @returns {List<T>} A list containing items. 
     */
    some(count: number=null): List<T>
    {
        if(!count)
            count = this.length;
        return this.sublist(0, count);
    }

    /**
     * Get the first item.
     * @returns {T} The item.
     */
    first(): T
    {
		if(this.length < 1)
			return null;
		return this.get(0);
    }

    /**
     * Get the last item.
     * @returns {T} The item.
     */
    last(): T
    {
        return this.get(this.length-1);
    }

	/**
	 * Add an element.
	 * @param {T} element - The element.
	 */
	add(element: T): void
	{
		this._elements.push(element);
	}

	/**
	 * Add multiple elements.
	 * @param {Array<T>} elements - The elements to be added.
	 */
	addMultiple(element: Array<T>): void
	{
		element.forEach((el)=>{this.add(el);});
	}

	/**
	 * Get the element at the given index.
	 * @param {number} elementIdx - The index.
	 * @return {T} The element.
	 */
	get(elementIdx: number): T
	{
		if(!JsTypes.isNumber(elementIdx))
			throw new VariableTypeError(PATH, "List.get(elementIdx)", elementIdx, "Number");

		if(elementIdx < 0 || elementIdx >= this.length)
			throw new VariableValueError(PATH, "List.get(elementIdx)", elementIdx, "-1<x<" + this.length);

		return this._elements[elementIdx];
	}

	/**
	 * Remove the element at the given index.
	 * @param {number} elementIdx - The index.
	 */
	remove(elementIdx: number): void
	{
		if(!JsTypes.isNumber(elementIdx))
			throw new VariableTypeError(PATH, "List.get(elementIdx)", elementIdx, "Number");

		if(elementIdx < 0 || elementIdx >= this.length)
			throw new VariableValueError(PATH, "List.get(elementIdx)", elementIdx, "-1<x<" + this.length);
		
  		delete this._elements[elementIdx];
	}

	/**
	 * Check if list contains element.
	 * @param {any} element - The element.
	 * @return {boolean} True if element is in the list, else false.
	 */
	has(element: any): boolean
	{
		if(this.indexOf(element) === -1)
			return false;
		return true;
	}

	/**
	 * Check if list does not contain element.
	 * @param {any} element - The element.
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
		for(let idx = 0; idx < this.length; idx++)
		{
			if(this.elementsEqual(this.get(idx), element))
				return idx;
		}
		return -1;
	}

	/**
	 * Create a copy of this list. If T implements clonable, create a deep copy, else a shallow copy.
	 */
	copy(): List<T>
	{
		let l = new List<T>();

		this.foreach((el: T) => {
			try
			{
				//@ts-ignore
				l.add(el.clone());
			}
			catch(err)
			{
				l.add(el);
			}
		;})

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
	private set elements(elements: Array<T>)
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