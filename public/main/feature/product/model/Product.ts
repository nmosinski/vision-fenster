import AbstractModel from "../../../common/orm/AbstractModel";


class Product extends AbstractModel<Product>
{
    protected Constructor: new () => Product = Product;
    
    constructor()
    {
        super();
    }

    addProperties(): void {
        throw new Error("Method not implemented.");
    }

    addRelations(): void 
    {
        throw new Error("Method not implemented.");
    }
}