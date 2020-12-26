import ProductOption from "./ProductOption"
import ProductModel from "./ProductModel";
import QueryResult from "../../../common/orm/QueryResult";
import AbstractStorableModel from "../../../common/orm/AbstractStorableModel";

class ProductOptionType extends AbstractStorableModel<ProductOptionType>{
    protected modelName: string;
    protected Constructor: new () => ProductOptionType;

    private _title: string;
    private _presentationde: string;
    private _productOptions: QueryResult<ProductOption>;
    private _productModel: ProductModel;

    init(): void
    {
        this.Constructor = ProductOptionType;
        this.modelName = 'ProductOptionType';
        this.productOptions = new QueryResult<ProductOption>();
    }

    addProperties(): void
    {
        this.properties.
            string('presentationde').
            string("title");
    }

    addRelations(): void
    {
        this.oneToMany(ProductOption);
        this.manyToOne(ProductModel);
    }

    productOptionsQ(): ProductOption
    {
        return this.relative(ProductOption);
    }

    productModelQ(): ProductModel
    {
        return this.relative(ProductModel);
    }

    addProductOption(productOption: ProductOption): void
    {
        if (this.productOptions.hasNot(productOption))
            this.productOptions.add(productOption);
    }

    set title(title: string)
    {
        this._title = title;
    }

    get title(): string
    {
        return this._title;
    }

    set productOptions(productOptions: QueryResult<ProductOption>)
    {
        this._productOptions = productOptions;
    }

    get productOptions(): QueryResult<ProductOption>
    {
        return this._productOptions;
    }

    set productModel(productModel: ProductModel)
    {
        this._productModel = productModel;
    }

    get productModel(): ProductModel
    {
        return this._productModel;
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

export default ProductOptionType;