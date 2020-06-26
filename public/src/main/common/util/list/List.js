const PATH = "public/src/main/common/util/list/List.js";

import IComparable from "public/src/main/common/util/IComparable.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js";

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

/**
 * @class
 * Class representing a List.
 */
class List extends IComparable()
{
	/**
	 * Create a List.
	 * @param {array} [elements=[]] - An array of elements that the list will contain from the beginning.
	 */
	constructor(elements=[])
	{
		super();
		this._elements = [];

		if(JsTypes.isArray(elements))
			for(let idx in elements)
				this.add(elements[idx]);
	}

	/**
	 * Return a new list containing only those items that are in this list and the one passed as argument.
	 * @param {List} list - The other list.
	 * @return {List} A new List containing items that are in both lists.
	 */
	AND(list)
	{
		if(!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List");
		
		return this.filter((el)=>{list.has(el);});
	}

	/**
	 * Return a new list containing all items that are in this list or the one passed as argument.
	 * @param {List} list - The other list.
	 * @return {List} A new List containing all items from both lists.
	 */
	OR(list)
	{
		if(!(list instanceof List))
			throw new VariableTypeError(PATH, "List.AND()", list, "List");
		
		let l = new List(this.toArray());

		list.foreach((el) => {
			if(!l.has(el))
				l.add(el);
		});
		return l;
	}

	/**
	 * Iterate through all elements of this list and calls the passed function.
	 * @param {function} f - The function to be called by each element of this list.
	 */
    foreach(f)
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

        for(let idx = 0; idx < this.length; idx++)
            f(this.get(idx));
    }

    /**
     * Filters all elements of this list by the given expression and returns a new list with the elements that match.
     * @param {function} f A function representing the filtering expression.
     * @return {List} A new list with the filtered elements.
     */
    filter(f)
    {
    	if(!JsTypes.isFunction(f))
    		throw new VariableTypeError(PATH, "List.foreach(f)", f, "function");

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
	 * Check if another list equals this list.
	 * @override
	 */
	equals(object)
	{
		if(!(object instanceof List))
			return false;
		
		for(let idx = 0; idx < object.length; idx++)
			if(!this.has(object.get(idx)))
				return false;
		
		if(!this.length() === object.length)
			return false;

		return true;
	}

	/**
	 * Get all elements of this list as array.
	 * @return {array} The elements.
	 */
    toArray()
    {
    	let ret = [];

    	for(let idx in this._elements)
    		ret.push(this._elements[idx]);

    	return ret;
    }

	/**
	 * Add an element.
	 * @param {?} element - The element.
	 */
	add(element)
	{
		this._elements.push(element);
	}

	/**
	 * Get the element at the given index.
	 * @param {number} elementIdx - The index.
	 * @return {?} The element.
	 */
	get(elementIdx)
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
	remove(elementIdx)
	{
		if(!JsTypes.isNumber(elementIdx))
			throw new VariableTypeError(PATH, "List.get(elementIdx)", elementIdx, "Number");

		if(elementIdx < 0 || elementIdx >= this.length)
			throw new VariableValueError(PATH, "List.get(elementIdx)", elementIdx, "-1<x<" + this.length);
		
  		delete this._elements[elementIdx];
	}

	/**
	 * Check if list contains element.
	 * @param {IComparable | string | boolean | number} element - The element.
	 * @return {boolean} True if element is in the list, else false.
	 */
	has(element)
	{
		if(this.indexOf(element) === -1)
			return false;
		return true;
	}

	/**
	 * Get the index of the given element.
	 * @param {IComparable | string | boolean | number} element - The element.
	 * @return {number} The index of the element, else -1, if the element is not in the list. 
	 */
	indexOf(element)
	{
		for(let idx = 0; idx < this.length; idx++)
		{
			if(this.get(idx) instanceof IComparable)
				if(this.get(idx).equals(element))
					return idx;
			else
				{
					if(this.get(idx) === element)
						return idx;
				}
		}
		return -1;
	}

	/**
	 * Create a copy of this list that refers to the same elements.
	 * @return {List} A shallow copy of this list.
	 */
	shallowCopy()
	{
		return new List(this.toArray());
	}

	/**
	 * Check if list is empty.
	 * @return {boolean} True if empty, else false.
	 */
	isEmpty()
	{
		return this.length === 0;
	}

	get length()
	{
		return this._elements.length;
	}
}

export default List;