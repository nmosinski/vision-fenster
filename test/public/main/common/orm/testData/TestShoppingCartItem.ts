import AbstractModel from "../../../../../../public/main/common/orm/AbstractModel";
import TestShoppingCart from "./TestShoppingCart";


class TestShoppingCartItem extends AbstractModel<TestShoppingCartItem>
{
    protected Constructor: new () => TestShoppingCartItem = TestShoppingCartItem;
    private _count: any;
    
    addProperties(): void 
    {
        this.properties.
        number("count", "positive").
        number("price", "positive");
    }
    
    addRelations(): void 
    {
        this.manyToOne(TestShoppingCart);
    }

    set count(count)
    {
        this._count = count;
    }

    get count()
    {
        return this._count;
    }

}

export default TestShoppingCartItem;