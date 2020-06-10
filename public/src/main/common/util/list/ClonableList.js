const PATH = "public/src/main/common/util/list/ClonableList.js";

import List from "public/src/main/common/util/list/List.js";

import IClonable from "public/src/main/common/util/IClonable.js";
import IComparable from "public/src/main/common/util/IComparable.js";

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"



/**
 * @class
 * Class representing a ClonableList.
 */
class ClonableList extends IClonable(List)
{
	/**
	 * Create a ClonableList.
	 * @typedef {(IComparable | IClonable)} IComparableANDIClonable
	 * @param {Array<IComparableANDIClonable | string | number | boolean>} array=null - An array of elements that the list will contain from the beginning.
	 */
	constructor(array=[])
	{
		super();

		if(JsTypes.isArray(array))
			for(let idx in array)
				this.add(array[idx]);
	}

	/**
	 * Add an element.
	 * @param {IComparableANDIClonable | string | number | boolean} element - The element.
	 * @throws {VariableTypeError} If element is not of type IComparable and IClonable or a primitive.
	 */
	add(element)
	{	
		if(!(element instanceof IClonable || JsTypes.isPrimitive(element)))
			throw new VariableTypeError(PATH, "ClonableList.add()", element, "(IComparable & IClonable) | string | number | boolean");	
		super.add(element);

	}

	/**
	 * Clone this list.
	 * @return {ClonableList} [A (deep) copy of this list.]
	 * @override
	 */
	clone()
	{
		let list = new ClonableList();
		
		for(let idx = 0; idx < this.length(); idx++)
			if(this.get(idx) instanceof IClonable)
				list.add(this.get(idx).clone());
			else
				list.add(this.get(idx));

		return list;
	}
}

export default ClonableList;