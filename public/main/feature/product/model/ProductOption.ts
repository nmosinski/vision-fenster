import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";


class ProductOption extends AbstractModel<ProductOption>
{
    private _productOptionType: ProductOptionType;
    private _value: string;
    private _tags: List<string>;
    private _image: string;

    protected Constructor: new () => ProductOption;
    init(): void 
    {
        this.Constructor = ProductOption;
    }

    addProperties(): void 
    {
        this.properties.
        string("value").
        string("image", "nullable");  
    }

    addRelations(): void 
    {
        this.manyToOne(ProductOptionType);
    }

    productOptionTypeQ()
    {
        return this.relative(ProductOptionType);
    }

    hasTag(tag: string): boolean
    {
        return this.tags.has(tag);
    }

    set productOptionType(type: ProductOptionType)
    {
        this._productOptionType = type;
    }

    set value(value: string)
    {
        this._value = value;
    }

    set tags(tags: List<string>)
    {
        if(tags)
            this._tags = tags;
        else
            this._tags = new List<string>();
    }

    set image(image: string)
    {
        if(image)
            this._image = image;
        else
            this._image = "";
    }

    get productOptionType(): ProductOptionType
    {
        return this._productOptionType;
    }

    get value(): string
    {
        return this._value;
    }

    get tags(): List<string>
    {
        return this._tags;
    }

    get image(): string
    {
        return this._image;
    }
}

export default ProductOption;
