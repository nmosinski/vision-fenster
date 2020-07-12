import TestShoppingCart from "./TestShoppingCart";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";

class TestUser extends AbstractModel<TestUser>
{
    protected Constructor: new () => TestUser;
    
    init(): void 
    {
        this.Constructor = TestUser;
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

}

export default TestUser;