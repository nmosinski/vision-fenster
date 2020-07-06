import AbstractModel from "public/main/common/AbstractModel.js"

class Product extends AbstractModel<Product>
{
    protected Constructor: new () => Product = Product;
    
    constructor()
    {
        super();
    }

    addRelations(): void 
    {
        throw new Error("Method not implemented.");
    }
}