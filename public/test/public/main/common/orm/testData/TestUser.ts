import TestShoppingCart from "./TestShoppingCart";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";

class TestUser extends AbstractModel<TestUser>
{
    protected modelName: string;
    protected Constructor: new () => TestUser;
    private _testShoppingCart: any;

    init(): void {
        this.Constructor = TestUser;
        this.modelName = 'TestUser';
    }

    addProperties(): void {
        this.properties.
            string("name");
    }

    addRelations(): void {
        this.oneToZeroOrOne(TestShoppingCart);
    }

    testShoppingCartQ() {
        return this.relative(TestShoppingCart);
    }

    set testShoppingCart(cart) {
        this._testShoppingCart = cart;
    }

    get testShoppingCart() {
        return this._testShoppingCart;
    }

}

export default TestUser;