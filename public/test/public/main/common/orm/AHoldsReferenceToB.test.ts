import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value} from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsReferenceToB from "../../../../../main/common/orm/AHoldsReferenceToB";
import ManyToOne from "../../../../../main/common/orm/ManyToOne";
const PATH = "test/public/main/common/orm/AHoldsReferenceToB.test.js"

var testShoppingCarts: List<TestShoppingCart>;
var testShoppingCartItems: List<TestShoppingCartItem>;
var relation: AHoldsReferenceToB<TestShoppingCartItem, TestShoppingCart>;

export async function runAllTests()
{
    let tests = new Tests(beforeAll, undefined, beforeEach, afterEach);
    
    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational destroy multiple", truthly(), relationalDestroyMultiple));
    
    await tests.runAll();
}

async function beforeAll()
{
    relation = new ManyToOne<TestShoppingCartItem, TestShoppingCart>(TestShoppingCartItem, TestShoppingCart);
    await afterEach();
}

async function beforeEach()
{
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 5);
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
    testShoppingCartItems.first()[testShoppingCarts.first().asFk()] = testShoppingCarts.first().id;
    let item = (await relation.relationalGet(testShoppingCartItems.first()));

    return testShoppingCarts.first().id === item.id;
}

async function relationalFind()
{
    testShoppingCartItems.foreach((item)=>{item[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.first().id});
    testShoppingCartItems.first()[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.get(1).id;
    let expectedSublist = testShoppingCarts.sublist(0,1);

    let result = await relation.relationalFind(testShoppingCartItems);
 
    return result.equals(expectedSublist);
}

async function relationalDestroy()
{
    for(let idx = 0; idx < testShoppingCartItems.length; idx++)
        testShoppingCartItems.get(idx)[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.first().id;
    testShoppingCartItems.last()[TestShoppingCart.asFk(TestShoppingCart)] = "None";
    
    await WixDatabase.updateMultiple(testShoppingCartItems);

    await relation.relationalDestroy(testShoppingCarts.first());
    let items = await WixDatabase.query(TestShoppingCartItem).execute();

    if(!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;

    return true;
}

async function relationalDestroyMultiple()
{
    for(let idx = 0; idx < testShoppingCartItems.length; idx++)
        testShoppingCartItems.get(idx)[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.get(idx).id;
    testShoppingCartItems.last()[TestShoppingCart.asFk(TestShoppingCart)] = "None";

    await WixDatabase.updateMultiple(testShoppingCartItems);

    await relation.relationalDestroyMultiple(testShoppingCarts);
    let items = await WixDatabase.query(TestShoppingCartItem).execute();

    if(!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;
    return true;
}