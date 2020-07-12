
import TestShoppingCartItem from "./TestShoppingCartItem";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";


class TestTag extends AbstractModel<TestTag>
{
    protected Constructor: new () => TestTag;
    private _testShoppingCartItems: any;
    
    init(): void 
    {
        this.Constructor = TestTag;
    }

    addProperties(): void 
    {
        this.properties.string("title");
    }
    
    addRelations(): void 
    {
        this.manyToMany(TestShoppingCartItem);
    }

    testShoppingCartItemsQ()
    {
        return this.relative(TestShoppingCartItem);
    }

    set testShoppingCartItems(items)
    {
        this._testShoppingCartItems = items;
    }

    get testShoppingCartItems()
    {
        return this._testShoppingCartItems;
    }
}

export default TestTag;