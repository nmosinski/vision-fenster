import AbstractModel from "../../../common/orm/AbstractModel";
import QueryResult from "../../../common/orm/QueryResult";
import ProductOption from "./ProductOption";


class Tag extends AbstractModel<Tag>{
    protected modelName: string;
    protected Constructor: new () => Tag;
    private _productOptions: QueryResult<ProductOption>;

    init(): void {
        this.Constructor = Tag;
        this.modelName = 'Tag';
        this.productOptions = new QueryResult<ProductOption>();
    }

    addProperties(): void {
        this.properties.
            string("title");
    }

    addRelations(): void {
        this.manyToMany(ProductOption);
    }

    addProductOption(productOption: ProductOption) {
        if (this.productOptions.hasNot(productOption))
            this.productOptions.add(productOption);

    }

    set productOptions(productOptions: QueryResult<ProductOption>) {
        this._productOptions = productOptions;
    }

    get productOptions(): QueryResult<ProductOption> {
        return this._productOptions;
    }
}

export default Tag;