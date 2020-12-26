
import TestShoppingCartItem from "./TestShoppingCartItem";
import AbstractStorableModel from "../../../../../../main/common/orm/AbstractStorableModel";


class TestTag extends AbstractStorableModel<TestTag>
{
    protected modelName: string;
    protected Constructor: new () => TestTag;
    private _testShoppingCartItems: never;

    init(): void
    {
        this.Constructor = TestTag;
        this.modelName = 'TestTag';
    }

    addProperties(): void
    {
        this.properties.string("title");
    }

    addRelations(): void
    {
        this.manyToMnever(TestShoppingCartItem);
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