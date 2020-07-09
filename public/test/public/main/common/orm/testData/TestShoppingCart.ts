
import TestShoppingCartItem from "./TestShoppingCartItem";
import TestUser from "./TestUser";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";


class TestShoppingCart extends AbstractModel<TestShoppingCart>
{
    protected Constructor: new () => TestShoppingCart = TestShoppingCart;
    
    addProperties(): void 
    {

    }
    
    addRelations(): void 
    {
        this.oneToMany(TestShoppingCartItem);
        this.zeroOroneToOne(TestUser);
    }

}

export default TestShoppingCart;