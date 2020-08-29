import List from "../list/List";
import { AnyNumber } from "../../supportive";


class Set<T> extends List<T>
{
    /**
	 * Create a Set.
	 * @param {Array<T>} [elements=Array<T>] - An array of elements that the Set will contain from the beginning. Duplicates will be added only once.
	 */
    constructor(elements?: AnyNumber<T>) {
        super(elements);
    }

    /**
     * @override
     * Add an element to the set if it doesn't exist yet.
     * @param {...T} elements - The element.
	 */
    add(...elements: Array<T>): void {
        this.addMultiple(elements);
    }

    /**
	 * Add elements.
	 * @param {Array<T>} elements - The elements.
	 */
    addMultiple(elements: Array<T>): void {
        for (let idx = 0; idx < elements.length; idx++)
            if (!this.has(elements[idx]))
                this._elements.push(elements[idx]);
    }
}

export default Set;