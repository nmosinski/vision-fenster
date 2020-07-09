import TestShoppingCart from "./TestShoppingCart";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";

class TestUser extends AbstractModel<TestUser>
{
    protected Constructor: new () => TestUser = TestUser;
    
    addProperties(): void 
    {
        this.properties.
        string("name");
    }
    
    addRelations(): void 
    {
        this.oneToZeroOrOne(TestShoppingCart);
    }

}

export default TestUser;