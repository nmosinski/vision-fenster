import AbstractModel from "../../../common/orm/AbstractModel";

class ProductConfiguration extends AbstractModel<ProductConfiguration>
{
    protected Constructor: new () => ProductConfiguration;
    
    init(): void 
    {
        this.Constructor = ProductConfiguration;
    }
    
    addProperties(): void
    {
        throw new Error("Method not implemented.");
    }

    addRelations(): void 
    {
        throw new Error("Method not implemented.");
    }
    
}