import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";
import Product from "./Product";
import QueryResult from "../../../common/orm/QueryResult";

class ProductModel extends AbstractModel<ProductModel> implements IsTypesizable {
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

    addProductOptionType(productOptionType: ProductOptionType) {
        if (!this.productOptionTypes)
            this.productOptionTypes = new QueryResult();
        if (this.productOptionTypes.hasNot(productOptionType))
            this.productOptionTypes.add(productOptionType);
    }

    typesize(json: any) {
        if (json.productOptionTypes && !(this.productOptionTypes instanceof QueryResult)) {
            this.productOptionTypes = new QueryResult<ProductOptionType>();
            json._productOptionTypes._elements.forEach((el: any) => {
                let productOptionType = new ProductOptionType(el);
                productOptionType.productModel = this;
                this.addProductOptionType(productOptionType);
                productOptionType.typesize(el);
            });
        }
        return this;
    }

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set productOptionTypes(productOptionTypes: QueryResult<ProductOptionType>) {
        this._productOptionTypes = productOptionTypes;
    }

    get productOptionTypes(): QueryResult<ProductOptionType> {
        return this._productOptionTypes;
    }

}

export default ProductModel;