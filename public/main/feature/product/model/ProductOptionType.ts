import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOption from "./ProductOption"
import List from "../../../common/util/collections/list/List";
import ProductModel from "./ProductModel";
import QueryResult from "../../../common/orm/QueryResult";
import { Query } from "../../../common/orm/WixDatabase";

class ProductOptionType extends AbstractModel<ProductOptionType> implements IsTypesizable {
    protected Constructor: new () => ProductOptionType;

    private _title: string;
    private _productOptions: QueryResult<ProductOption>;
    private _productModel: ProductModel;

    init(): void {
        this.Constructor = ProductOptionType;
    }

    addProperties(): void {
        this.properties.
            string("title");
    }

    addRelations(): void {
        this.oneToMany(ProductOption);
        this.manyToOne(ProductModel);
    }

    productOptionsQ() {
        return this.relative(ProductOption);
    }

    productModelQ() {
        return this.relative(ProductModel);
    }

    addProductOption(productOption: ProductOption) {
        if (!this.productOptions)
            this.productOptions = new QueryResult();
        if (this.productOptions.hasNot(productOption))
            this.productOptions.add(productOption);
    }

    typesize(json: any) {

        if (json._productModel && !(this.productModel instanceof ProductModel)) {
            this.productModel = (new ProductModel(json._productModel));
            this.productModel.addProductOptionType(this);
            this.productModel.typesize(json._productModel);
        }
        if (json._productOptions && !(this.productOptions instanceof QueryResult)) {
            this.productOptions = new QueryResult<ProductOption>();
            json._productOptions._elements.forEach((el) => {
                let productOption = (new ProductOption(el));
                productOption.productOptionType = this;
                this.addProductOption(productOption);
                productOption.typesize(el);
            });
        }
        return this;
    }

    set title(title: string) {
        this._title = title;
    }

    set productOptions(productOptions: QueryResult<ProductOption>) {
        this._productOptions = productOptions;
    }

    set productModel(productModel: ProductModel) {
        this._productModel = productModel;
    }

    get title(): string {
        return this._title;
    }

    get productOptions(): QueryResult<ProductOption> {
        return this._productOptions;
    }

    get productModel() {
        return this._productModel;
    }
}

export default ProductOptionType;