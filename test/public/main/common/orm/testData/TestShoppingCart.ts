import AbstractModel from "../../../../../../public/main/common/orm/AbstractModel";
import TestShoppingCartItem from "./TestShoppingCartItem";
import TestUser from "./TestUser";


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