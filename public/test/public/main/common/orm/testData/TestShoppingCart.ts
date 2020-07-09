
import TestShoppingCartItem from "./TestShoppingCartItem";
import TestUser from "./TestUser";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";


class TestShoppingCart extends AbstractModel<TestShoppingCart>
{
    protected Constructor: new () => TestShoppingCart;
    
    init(): void 
    {
        this.Constructor = TestShoppingCart;
    }

    addProperties(): void 
    {

    }
    
    addRelations(): void 
    {
        this.oneToMany(TestShoppingCartItem);
        this.zeroOrOneToOne(TestUser);
    }

}

export default TestShoppingCart;