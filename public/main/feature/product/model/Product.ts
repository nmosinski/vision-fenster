import KVMap from "../../../common/util/collections/map/KVMap";
import ProductOption from "./ProductOption";
import List from "../../../common/util/collections/list/List";

class Product
{
    private _options: KVMap<string, ProductOption>;

    constructor(options?: List<ProductOption>)
    {
        this.options = (options)?options: new List<ProductOption>();
    }

    setOption(option: ProductOption): void
    {
        this._options.add(option.productOptionType.title, option);
    }

    hasOption(typeTitle: string): boolean
    {
        if(this._options.hasKey(typeTitle))
            return true;
        return false;
    }

    getOption(typeTitle: string): ProductOption
    {
        return this._options.get(typeTitle);
    }

    removeOption(typeTitle: string): void
    {
        this._options.remove(typeTitle);
    }

    set options(options: List<ProductOption>)
    {
        this._options = new KVMap<string, ProductOption>();
        options.foreach((option) => {this.setOption(option);});
    }

    get options(): List<ProductOption>
    {
        return this._options.values();
    }
}

export default Product;