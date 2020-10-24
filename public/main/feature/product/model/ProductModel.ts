import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";
import Product from "./Product";
import QueryResult from "../../../common/orm/QueryResult";
import AbstractStorableModel from "../../../common/orm/AbstractStorableModel";

class ProductModel extends AbstractStorableModel<ProductModel>{
    protected modelName: string;
    protected Constructor: new () => ProductModel;
    private _productOptionTypes: QueryResult<ProductOptionType>;
    private _title: string;
    private _presentationde: string;

    init(): void
    {
        this.Constructor = ProductModel;
        this.modelName = 'ProductModel';
        this.productOptionTypes = new QueryResult<ProductOptionType>();
    }

    addProperties(): void
    {
        this.properties.
            string("presentationde").
            string("title");
    }

    addRelations(): void
    {
        this.oneToMany(ProductOptionType);
        this.oneToZeroOrOne(Product);
    }

    productOptionTypesQ()
    {
        return this.relative(ProductOptionType);
    }

    getProductOptionType(title: string): ProductOptionType
    {
        return this._productOptionTypes.find((el) => el.title === title.toLowerCase());
    }

    addProductOptionType(productOptionType: ProductOptionType)
    {
        if (this.productOptionTypes.hasNot(productOptionType))
            this.productOptionTypes.add(productOptionType);
    }

    set title(title: string)
    {
        this._title = title;
    }

    get title(): string
    {
        return this._title;
    }

    set productOptionTypes(productOptionTypes: QueryResult<ProductOptionType>)
    {
        this._productOptionTypes = productOptionTypes;
    }

    get productOptionTypes(): QueryResult<ProductOptionType>
    {
        return this._productOptionTypes;
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

export default ProductModel;