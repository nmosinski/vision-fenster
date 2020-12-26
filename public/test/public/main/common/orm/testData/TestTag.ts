
import TestShoppingCartItem from "./TestShoppingCartItem";
import AbstractStorableModel from "../../../../../../main/common/orm/AbstractStorableModel";
import QueryResult from "../../../../../../main/common/orm/QueryResult";


class TestTag extends AbstractStorableModel<TestTag>
{
    protected modelName: string;
    protected Constructor: new () => TestTag;
    private _testShoppingCartItems: QueryResult<TestShoppingCartItem>;

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
        this.manyToMany(TestShoppingCartItem);
    }

    testShoppingCartItemsQ(): TestShoppingCartItem
    {
        return this.relative(TestShoppingCartItem);
    }

    set testShoppingCartItems(items: QueryResult<TestShoppingCartItem>)
    {
        this._testShoppingCartItems = items;
    }

    get testShoppingCartItems(): QueryResult<TestShoppingCartItem>
    {
        return this._testShoppingCartItems;
    }
}

export default TestTag;