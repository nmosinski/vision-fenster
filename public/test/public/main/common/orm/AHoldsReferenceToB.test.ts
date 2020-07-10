import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value} from "../../../../../main/common/test/Test";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsReferenceToB from "../../../../../main/common/orm/AHoldsReferenceToB";
import ManyToOne from "../../../../../main/common/orm/ManyToOne";
const PATH = "test/public/main/common/orm/AbstractModel.test.js"

var testShoppingCarts: List<TestShoppingCart>;
var testShoppingCartItems: List<TestShoppingCartItem>;
var relation: AHoldsReferenceToB<TestShoppingCartItem, TestShoppingCart>

function initTestData()
{
    relation = new ManyToOne<TestShoppingCartItem, TestShoppingCart>(TestShoppingCartItem, TestShoppingCart);
}

export async function runAllTests()
{
    initTestData();
 
    let tests = new Tests(afterEach, null, beforeEach, afterEach);
    
    tests.add(new Test(PATH, "relational get", value(testShoppingCarts.first().id), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", unspecified(), relationalDestroy));
    tests.add(new Test(PATH, "relational destroy multiple", truthly(), relationalDestroyMultiple));
    
    await tests.runAll();
}


async function beforeEach()
{
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    await WixDatabase.createMultiple(testShoppingCarts);
    await WixDatabase.createMultiple(testShoppingCartItems);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function relationalGet()
{
    let result = await AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart);
    if(result)
        return result.id;
    else
        return result;
}

async function relationalFind()
{
    let result = await AbstractModel.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function relationalDestroy()
{
    await TestUser.destroy(testUsers.first());
    let result = await TestUser.get(testUsers.first().id, TestUser);
    return result;
}

async function relationalDestroyMultiple()
{
    await TestUser.destroyMultiple(testUsers);
    let result = await TestUser.find(TestUser);
    return result.isEmpty();
}