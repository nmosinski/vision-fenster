import KVMap from "../../../common/util/collections/map/KVMap";
import ProductOption from "./ProductOption";
import List from "../../../common/util/collections/list/List";
import AbstractModel from "../../../common/orm/AbstractModel";
import ProductModel from "./ProductModel";
import QueryResult from "../../../common/orm/QueryResult";

class Product extends AbstractModel<Product>{
    protected Constructor: new () => Product;
    private _productOptions: QueryResult<ProductOption>;
    private _image: string;
    private _price: number;
    private _productModelId: string;

    init(): void {
        this.Constructor = Product;
        this.productOptions = new QueryResult<ProductOption>();
    }
    addProperties(): void {
        this.properties
            .string("image", "nullable")
            .number("price", "positive");
    }
    addRelations(): void {
        this.zeroOrOneToOne(ProductModel);
        this.manyToMany(ProductOption);
    }

    setOption(option: ProductOption): void {
        this._productOptions.add(option);
    }

    hasOption(typeTitle: string): boolean {
        try {
            this._productOptions.find((opt) => opt.productOptionType.title === typeTitle);
            return true;
        }
        catch (err) {
            return false;
        }
    }

    getOption(typeTitle: string): ProductOption {
        return this._productOptions.find((productOption) => productOption.productOptionType.title === typeTitle);
    }

    removeOption(typeTitle: string): void {
        this._productOptions.remove(this._productOptions.indexOf(this._productOptions.findOrNull(productOption => productOption.productOptionType.title === typeTitle)));
    }

    productModelQ() {
        return this.relative(ProductModel).get();
    }

    set productModelId(productModelId: string) {
        this._productModelId = productModelId;
    }

    get productModelId(): string {
        return this._productModelId;
    }

    set price(price: number) {
        this._price = price;
    }

    get price(): number {
        return this._price;
    }

    set image(image: string) {
        this._image = image;
    }

    get image(): string {
        return this._image;
    }

    set productOptions(options: QueryResult<ProductOption>) {
        this._productOptions = options;
    }

    get productOptions(): QueryResult<ProductOption> {
        return this._productOptions;
    }
}

export default Product;