import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";
import QueryResult from "../../../common/orm/QueryResult";
import Tag from "./Tag";
import { Query } from "../../../common/orm/WixDatabase";


class ProductOption extends AbstractModel<ProductOption>{
    protected modelName: string;
    private _productOptionType: ProductOptionType;
    private _value: string;
    private _presentationde: string;
    private _tags: QueryResult<Tag>;
    private _image: string;

    protected Constructor: new () => ProductOption;
    init(): void
    {
        this.Constructor = ProductOption;
        this.modelName = 'ProductOption';
        this.tags = new QueryResult<Tag>();
    }

    addProperties(): void
    {
        this.properties.
            string("value").
            string('presentationde').
            string("image", "nullable");
    }

    addRelations(): void
    {
        this.manyToOne(ProductOptionType);
        this.manyToMany(Tag);
    }

    productOptionTypeQ()
    {
        return this.relative(ProductOptionType);
    }

    tagsQ()
    {
        return this.relative(Tag);
    }

    hasTagOfTitle(tagTitle: string): boolean
    {
        return this.tags.reduce("title").has(tagTitle);
    }

    addTag(tag: Tag)
    {
        if (this.tags.hasNot(tag))
            this.tags.add(tag);
    }

    set productOptionType(type: ProductOptionType)
    {
        this._productOptionType = type;
    }

    get productOptionType(): ProductOptionType
    {
        return this._productOptionType;
    }

    set value(value: string | number)
    {
        this._value = '' + value;
    }

    get value(): string | number
    {
        return (isNaN(parseInt(this._value, 10))) ? this._value : parseInt(this._value, 10);
    }

    set tags(tags: QueryResult<Tag>)
    {
        this._tags = tags;
    }

    get tags(): QueryResult<Tag>
    {
        return this._tags;
    }

    set image(image: string)
    {
        if (image)
            this._image = image;
        else
            this._image = "";
    }

    get image(): string
    {
        return this._image;
    }

    set presentationde(presentation: string)
    {
        this._presentationde = presentation;
    }

    get presentationde(): string
    {
        return this._presentationde;
    }
}

export default ProductOption;
