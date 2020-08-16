import AbstractModel from "../orm/AbstractModel";
import ProductOption from "../../feature/product/model/ProductOption";
import ProductOptionType from "../../feature/product/model/ProductOptionType";
import QueryResult from "../orm/QueryResult";
import Product from "../../feature/product/model/Product";

class Tag extends AbstractModel<Tag> implements IsTypesizable {
    protected Constructor: new () => Tag;
    private _productOptions: QueryResult<ProductOption>;

    init(): void {
        this.Constructor = Tag;
    }

    addProperties(): void {
        this.properties.
            string("title");
    }

    addRelations(): void {
        this.manyToMany(ProductOption);
    }

    typesize(json: any): this {

        if (this.productOptions && !(this.productOptions instanceof QueryResult)) {
            this.productOptions = new QueryResult<ProductOption>();
            json._productOptions._elements.forEach((el) => {
                this.productOptions.add((new ProductOption(el)).typesize(el));
            });
        }
        return this;
    }

    set productOptions(productOptions: QueryResult<ProductOption>) {
        this._productOptions = productOptions;
    }

    get productOptions(): QueryResult<ProductOption> {
        return this._productOptions;
    }
}

export default Tag;