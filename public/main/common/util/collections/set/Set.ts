import List from "../list/List";


class Set<T> extends List<T>
{
    /**
	 * Create a Set.
	 * @param {Array<T>} [elements=Array<T>] - An array of elements that the Set will contain from the beginning. Duplicates will be added only once.
	 */
    constructor(elements: Array<T>=[])
    {
        super(elements);
    }

    /**
     * @override
     * Add an element to the set if it doesn't exist yet.
     * @param {T} element - The element.
	 */
	add(element: T): void
	{
        if(this.has(element))
            super.add(element);
	}
}

export default Set;