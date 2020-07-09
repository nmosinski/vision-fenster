import AbstractModel from "../../../common/orm/AbstractModel";


class Product extends AbstractModel<Product>
{
    protected Constructor: new () => Product;
    
    constructor()
    {
        super();
    }

    init(): void {
        this.Constructor = Product;
        throw new Error("Method not implemented.");
    }

    addProperties(): void {
        throw new Error("Method not implemented.");
    }

    addRelations(): void 
    {
        throw new Error("Method not implemented.");
    }
}