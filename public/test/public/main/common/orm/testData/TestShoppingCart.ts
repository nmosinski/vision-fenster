
import TestShoppingCartItem from "./TestShoppingCartItem";
import TestUser from "./TestUser";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";


class TestShoppingCart extends AbstractModel<TestShoppingCart>
{
    protected modelName: string;
    protected Constructor: new () => TestShoppingCart;
    private _testUser: TestUser;
    private _testShoppingCartItems: any;

    init(): void
    {
        this.Constructor = TestShoppingCart;
        this.modelName = 'TestShoppingCart';
    }

    addProperties(): void
    {

    }

    addRelations(): void
    {
        this.oneToMany(TestShoppingCartItem);
        this.zeroOrOneToOne(TestUser);
    }

    testUserQ()
    {
        return this.relative(TestUser);
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

    set testUser(user: TestUser)
    {
        this._testUser = user;
    }

    get testUser()
    {
        return this._testUser;
    }
}

export default TestShoppingCart;