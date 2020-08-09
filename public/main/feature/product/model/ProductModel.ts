import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";
import Product from "./Product";
import QueryResult from "../../../common/orm/QueryResult";

class ProductModel extends AbstractModel<ProductModel>
{
    protected Constructor: new () => ProductModel;
    private _productOptionTypes: QueryResult<ProductOptionType>;
    private _title: string;

    init(): void {
        this.Constructor = ProductModel;
    }

    addProperties(): void {
        this.properties.
            string("title");
    }

    addRelations(): void {
        this.oneToMany(ProductOptionType);
        this.oneToZeroOrOne(Product);
    }

    productOptionTypesQ() {
        return this.relative(ProductOptionType);
    }

    getProductOptionType(title: string): ProductOptionType {
        return this._productOptionTypes.find((el) => el.title === title.toLowerCase());
    }

    addProductOptionType(type: ProductOptionType) {
        this._productOptionTypes.add(type);
    }

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set productOptionTypes(productOptionTypes: QueryResult<ProductOptionType>) {
        this._productOptionTypes = new QueryResult<ProductOptionType>(productOptionTypes);
    }

    get productOptionTypes(): QueryResult<ProductOptionType> {
        return this.productOptionTypes;
    }

}

export default ProductModel;