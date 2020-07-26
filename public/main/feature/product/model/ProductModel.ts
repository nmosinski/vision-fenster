import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";
import Product from "./Product";

class ProductModel extends AbstractModel<ProductModel>
{
    protected Constructor: new () => ProductModel;
    private _productOptionTypes: KVMap<string, ProductOptionType>;
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
        return this._productOptionTypes.get(title.toLowerCase());
    }

    addProductOptionType(type: ProductOptionType) {
        this._productOptionTypes.add(type.title.toLowerCase(), type);
    }

    set title(title: string) {
        this._title = title;
    }

    get title(): string {
        return this._title;
    }

    set productOptionTypes(productOptionTypes: List<ProductOptionType>) {
        this._productOptionTypes = new KVMap<string, ProductOptionType>();
        productOptionTypes.foreach(type => this.addProductOptionType(type));
    }

    get productOptionTypes(): List<ProductOptionType> {
        return this._productOptionTypes.values();
    }

}

export default ProductModel;