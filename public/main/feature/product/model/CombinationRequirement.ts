import List from "../../../common/util/collections/list/List";

class CombinationRequirement
{
    private _productOptionType: string;
    private _tags: List<string>;

    constructor (productOptionType: string, tags?: List<string>)
    {
        this.productOptionType = productOptionType;
        this.tags = (tags) ? tags : new List<string>();
    }

    addTag(tag: string): void
    {
        this.tags.add(tag);
    }

    removeTag(tag: string): void
    {
        this.tags.remove(this.tags.indexOf(tag));
    }

    set productOptionType(productOptionType: string)
    {
        this._productOptionType = productOptionType;
    }

    get productOptionType(): string
    {
        return this._productOptionType;
    }

    set tags(tags: List<string>)
    {
        this._tags = tags;
    }

    get tags(): List<string>
    {
        return this._tags;
    }
}

export default CombinationRequirement;