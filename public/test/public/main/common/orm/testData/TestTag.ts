
import TestShoppingCartItem from "./TestShoppingCartItem";
import AbstractModel from "../../../../../../main/common/orm/AbstractModel";


class TestTag extends AbstractModel<TestTag>
{
    protected Constructor: new () => TestTag;
    
    init(): void 
    {
        this.Constructor = TestTag;
    }

    addProperties(): void 
    {
        this.properties.string("title");
    }
    
    addRelations(): void 
    {
        this.manyToMany(TestShoppingCartItem);
    }

    testShoppingCartItems()
    {
        return this.relative(TestShoppingCartItem);
    }
}

export default TestTag;