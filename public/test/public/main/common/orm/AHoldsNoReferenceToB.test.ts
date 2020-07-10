import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value} from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsNoReferenceToB from "../../../../../main/common/orm/AHoldsNoReferenceToB";
import OneToMany from "../../../../../main/common/orm/OneToMany";
const PATH = "test/public/main/common/orm/AHoldsNoReferenceToB.test.js"

var testShoppingCarts: List<TestShoppingCart>;
var testShoppingCartItems: List<TestShoppingCartItem>;
var relation: AHoldsNoReferenceToB<TestShoppingCart, TestShoppingCartItem>;

export async function runAllTests()
{
    let tests = new Tests(beforeAll, null, beforeEach, afterEach);
    
    tests.add(new Test(PATH, "relational assign", truthly(), relationalAssign));
    tests.add(new Test(PATH, "relational assignMultiple", truthly(), relationalAssignMultiple));
    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    
    await tests.runAll();
}

async function beforeAll()
{
    relation = new OneToMany<TestShoppingCart, TestShoppingCartItem>(TestShoppingCart, TestShoppingCartItem);
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

function relationalAssign()
{
    relation.assign(testShoppingCartItems.first(), testShoppingCarts.first());
    return testShoppingCartItems.first()[TestShoppingCart.asFk(TestShoppingCart)] === testShoppingCarts.first().id;
}

function relationalAssignMultiple()
{
    let ret = true;
    relation.assignMultiple(testShoppingCartItems, testShoppingCarts.first());

    testShoppingCartItems.foreach((item)=>{
        if(item[TestShoppingCart.asFk(TestShoppingCart)] !== testShoppingCarts.first().id)
            ret = false;
    });
    return ret;
}

async function relationalGet()
{
    testShoppingCartItems.first()[testShoppingCarts.first().asFk()] = testShoppingCarts.first().id;
    await TestShoppingCartItem.update(testShoppingCartItems.first());
    
    let item = (await relation.relationalGet(testShoppingCarts.first()));

    return testShoppingCartItems.first().id === item.id;
}

async function relationalFind()
{
    testShoppingCartItems.foreach((item)=>{item[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.first().id});
    testShoppingCartItems.first()[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.get(1).id;
    await TestShoppingCartItem.updateMultiple(testShoppingCartItems);
    let expectedSublist = testShoppingCartItems;

    let result = await relation.relationalFind(testShoppingCarts);

    return result.equals(expectedSublist);
}