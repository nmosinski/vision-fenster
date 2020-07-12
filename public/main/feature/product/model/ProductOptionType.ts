import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOption from "./ProductOption"
import List from "../../../common/util/collections/list/List";
import ProductModel from "./ProductModel";

class ProductOptionType extends AbstractModel<ProductOptionType>
{
    protected Constructor: new () => ProductOptionType;
    
    private _title: string;
    private _productOptions: List<ProductOption>;
    private _productModel: ProductModel;

    init(): void 
    {
        this.Constructor = ProductOptionType;
    }

    addProperties(): void 
    {
        this.properties.
        string("title");
    }

    addRelations(): void 
    {
        this.oneToMany(ProductOption);
        this.manyToOne(ProductModel);
    }

    productOptionsQ()
    {
        return this.relative(ProductOption);
    }

    productModelQ()
    {
        return this.relative(ProductModel);
    }

    set title(title: string)
    {
        this._title = title;
    }

    set productOptions(productOptions: List<ProductOption>)
    {
        this._productOptions = productOptions;
    }

    set productModel(productModel: ProductModel)
    {
        this._productModel = productModel;
    }

    get title(): string
    {
        return this._title;
    }

    get productOptions()
    {
        return this._productOptions;
    }

    get productModel()
    {
        return this._productModel;
    }
}

export default ProductOptionType;