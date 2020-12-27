import ProductOption from "./ProductOption";
import ProductModel from "./ProductModel";
import QueryResult from "../../../common/orm/QueryResult";
import AbstractStorableModel from "../../../common/orm/AbstractStorableModel";

class ProductConfiguration extends AbstractStorableModel<ProductConfiguration>{
    protected modelName: string;
    protected Constructor: new () => ProductConfiguration;
    private _productOptions: QueryResult<ProductOption>;
    private _productModel: ProductModel;
    private _image: string;
    private _price: number;
    private _productModelId: string;

    init(): void
    {
        this.Constructor = ProductConfiguration;
        this.modelName = 'Product';
        this.productOptions = new QueryResult<ProductOption>();
    }
    addProperties(): void
    {
        this.properties
            .string("image", "nullable")
            .number("price", "positive");
    }
    addRelations(): void
    {
        this.zeroOrOneToOne(ProductModel);
        this.manyToMany(ProductOption);
    }

    saveOption(option: ProductOption): void
    {
        if (this.hasOption(option.productOptionType.title))
            this.removeOption(option.productOptionType.title);
        this._productOptions.add(option);
    }

    hasOption(typeTitle: string): boolean
    {
        try
        {
            this._productOptions.find((opt) => opt.productOptionType.title === typeTitle);
            return true;
        }
        catch (err)
        {
            return false;
        }
    }

    getOption(typeTitle: string): ProductOption
    {
        return this._productOptions.find((productOption) => productOption.productOptionType.title === typeTitle);
    }

    removeOption(typeTitle: string): void
    {
        const optIdx = this._productOptions.indexOf(this._productOptions.findOrNull(productOption => productOption.productOptionType.title === typeTitle));
        if (optIdx !== -1)
            this._productOptions.remove(optIdx);
    }

    productModelQ(): ProductModel
    {
        return this.relative(ProductModel);
    }

    set productModelId(productModelId: string)
    {
        this._productModelId = productModelId;
    }

    get productModelId(): string
    {
        return this._productModelId;
    }

    set price(price: number)
    {
        this._price = price;
    }

    get price(): number
    {
        return this._price;
    }

    set image(image: string)
    {
        this._image = image;
    }

    get image(): string
    {
        return this._image;
    }

    set productOptions(options: QueryResult<ProductOption>)
    {
        this._productOptions = options;
    }

    get productOptions(): QueryResult<ProductOption>
    {
        return this._productOptions;
    }

    set productModel(productModel: ProductModel)
    {
        this._productModel = productModel;
    }

    get productModel(): ProductModel | null
    {
        return this._productModel;
    }
}

export default ProductConfiguration;