import KVMap from "../../../common/util/collections/map/KVMap";
import List from "../../../common/util/collections/list/List";
import ProductOptionDefinition from "./ProductOptionDefinition";

class ProductDefinition
{
    private _productOptionDefinitions: KVMap<string, ProductOptionDefinition>;
    private _model: string;

    constructor(model: string, productOptionDefinitions: List<ProductOptionDefinition>=new List<ProductOptionDefinition>())
    {
        this.model = model;
        this.productOptionDefinitions = productOptionDefinitions;
    }

    setProductOptionDefinition(productOptionDefinition: ProductOptionDefinition): void
    {
        this._productOptionDefinitions.add(productOptionDefinition.type, productOptionDefinition);
    }

    hasProductOptionDefinition(type: string): boolean
    {
        return (this._productOptionDefinitions.hasKey(type))?true:false;
    }

    getProductOptionDefinition(type: string): ProductOptionDefinition
    {
        return this._productOptionDefinitions.get(type);
    }

    getRequiredProductOptionDefinitions(): List<ProductOptionDefinition>
    {
        return this.productOptionDefinitions.filter((def)=>{return def.required;});
    }

    removeProductOptionDefinition(type: string): void
    {
        this._productOptionDefinitions.remove(type);
    }

    set model(model: string)
    {
        this._model = model;
    }

    set productOptionDefinitions(productOptionDefinitions: List<ProductOptionDefinition>)
    {
        this._productOptionDefinitions = new KVMap<string, ProductOptionDefinition>();
        productOptionDefinitions.foreach((definition)=>{this.setProductOptionDefinition(definition)});
    }

    get model(): string
    {
        return this._model;
    }

    get productOptionDefinitions(): List<ProductOptionDefinition>
    {
        return this._productOptionDefinitions.values();
    }
}

export default ProductDefinition;