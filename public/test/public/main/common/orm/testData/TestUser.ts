import AbstractStorableModel from "../../../../../../main/common/orm/AbstractStorableModel";
import TestShoppingCart from "./TestShoppingCart";

class TestUser extends AbstractStorableModel<TestUser>
{
    protected modelName: string;
    protected Constructor: new () => TestUser;
    private _testShoppingCart: never;

    init(): void
    {
        this.Constructor = TestUser;
        this.modelName = 'TestUser';
    }

    addProperties(): void
    {
        this.properties.
            string("name");
    }

    addRelations(): void
    {
        this.oneToZeroOrOne(TestShoppingCart);
    }

    testShoppingCartQ()
    {
        return this.relative(TestShoppingCart);
    }

    set testShoppingCart(cart)
    {
        this._testShoppingCart = cart;
    }

    get testShoppingCart()
    {
        return this._testShoppingCart;
    }

}

export default TestUser;