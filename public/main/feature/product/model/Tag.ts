import AbstractModel from "../../../common/orm/AbstractModel";
import QueryResult from "../../../common/orm/QueryResult";
import ProductOption from "./ProductOption";


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

    addProductOption(productOption: ProductOption) {
        if (!this.productOptions)
            this.productOptions = new QueryResult();
        if (this.productOptions.hasNot(productOption))
            this.productOptions.add(productOption);
    }

    typesize(json: any): this {

        if (json._productOptions && !(this.productOptions instanceof QueryResult)) {
            this.productOptions = new QueryResult<ProductOption>();
            json._productOptions._elements.forEach((el) => {
                let productOption = new ProductOption(el);
                productOption.addTag(this);
                this.addProductOption(productOption);
                productOption.typesize(el);
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