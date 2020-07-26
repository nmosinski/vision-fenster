import KVMap from "../../../common/util/collections/map/KVMap";
import ProductOption from "./ProductOption";
import List from "../../../common/util/collections/list/List";
import AbstractModel from "../../../common/orm/AbstractModel";
import ProductModel from "./ProductModel";

class Product extends AbstractModel<Product>{
    protected Constructor: new () => Product;
    private _productOptions: KVMap<string, ProductOption>;
    private _image: string;
    private _price: number;
    private _productModelId: string;

    init(): void {
        this.Constructor = Product;
        this.productOptions = new List<ProductOption>();
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
        this._productOptions.add(option.productOptionType.title, option);
    }

    hasOption(typeTitle: string): boolean {
        if (this._productOptions.hasKey(typeTitle))
            return true;
        return false;
    }

    getOption(typeTitle: string): ProductOption {
        return this._productOptions.get(typeTitle);
    }

    removeOption(typeTitle: string): void {
        this._productOptions.remove(typeTitle);
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

    set productOptions(options: List<ProductOption>) {
        this._productOptions = new KVMap<string, ProductOption>();
        options.foreach((option) => { this.setOption(option); });
    }

    get productOptions(): List<ProductOption> {
        return this._productOptions.values();
    }
}

export default Product;