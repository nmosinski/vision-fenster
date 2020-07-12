import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOptionType from "./ProductOptionType";
import List from "../../../common/util/collections/list/List";

class ProductModel extends AbstractModel<ProductModel>
{
    protected Constructor: new () => ProductModel;
    private _productOptionTypes: List<ProductOptionType>;
    
    init(): void 
    {
        this.Constructor = ProductModel;
    }

    addProperties(): void 
    {
        this.properties.
        string("title");
    }

    addRelations(): void 
    {
        this.oneToMany(ProductOptionType);
    }

    productOptionTypesQ()
    {
        return this.relative(ProductOptionType);
    }

    set productOptionTypes(productOptionTypes: List<ProductOptionType>)
    {
        this._productOptionTypes = productOptionTypes;
    }

    get productOptionTypes()
    {
        return this._productOptionTypes;
    }
    
}

export default ProductModel;