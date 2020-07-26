import KVMap from "../../../common/util/collections/map/KVMap";
import ProductOption from "./ProductOption";
import List from "../../../common/util/collections/list/List";
import AbstractModel from "../../../common/orm/AbstractModel";

class Product extends AbstractModel<Product>{
    protected Constructor: new () => Product;
    private _options: KVMap<string, ProductOption>;
    private _image: string;
    private _price: number;

    init(): void {
        this.Constructor = Product;
    }
    addProperties(): void {
        this.properties
            .string("image", "nullable")
            .number("price", "positive");
    }
    addRelations(): void {
        throw new Error("Method not implemented.");
    }

    setOption(option: ProductOption): void {
        this._options.add(option.productOptionType.title, option);
    }

    hasOption(typeTitle: string): boolean {
        if (this._options.hasKey(typeTitle))
            return true;
        return false;
    }

    getOption(typeTitle: string): ProductOption {
        return this._options.get(typeTitle);
    }

    removeOption(typeTitle: string): void {
        this._options.remove(typeTitle);
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

    set options(options: List<ProductOption>) {
        this._options = new KVMap<string, ProductOption>();
        options.foreach((option) => { this.setOption(option); });
    }

    get options(): List<ProductOption> {
        return this._options.values();
    }
}

export default Product;