import AbstractModel from "../../../../../../public/main/common/orm/AbstractModel";
import TestShoppingCart from "./TestShoppingCart";

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