import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsNoReferenceToB from "../../../../../main/common/orm/AHoldsNoReferenceToB";
import OneToMany from "../../../../../main/common/orm/OneToMany";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import JsTypes from "../../../../../main/common/util/jsTypes/JsTypes";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import TestShoppingCartDiffColName from "./testData/TestShoppingCartDiffColName";
const PATH = "test/public/main/common/orm/AHoldsNoReferenceToB.test.js"

let testShoppingCarts: QueryResult<TestShoppingCart>;
let testShoppingCartItems: QueryResult<TestShoppingCartItem>;
let testShoppingCartDiffColName: TestShoppingCartDiffColName;
let relation: AHoldsNoReferenceToB<TestShoppingCart, TestShoppingCartItem>;

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "relational assign", truthly(), relationalAssign));
    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "different column name", truthly(), differentColumnName));

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
    testShoppingCartDiffColName = TestShoppingCartDiffColName.dummy(TestShoppingCartDiffColName);
    await WixDatabase.create(testShoppingCarts);
    await WixDatabase.create(testShoppingCartItems);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function relationalDestroy()
{
    await testShoppingCarts.assign(testShoppingCartItems);
    await testShoppingCartItems.save();
    await testShoppingCarts.destroy();
    const shoppingCarts = await AbstractModel.find(TestShoppingCart);
    const shoppingCartItems = await AbstractModel.find(TestShoppingCartItem);
    if (shoppingCarts.length > 0)
    {
        console.log("shoppingCarts", shoppingCarts);
        console.log("first if");
        return false;
    }

    if (shoppingCartItems.length > 0)
    {
        console.log("shoppingCartItems", shoppingCartItems);
        console.log("second if");
        return false;
    }
    return true;
}

async function relationalAssign()
{
    let ret = true;

    await relation.assign(testShoppingCartItems.first(), testShoppingCarts.first());
    ret = testShoppingCartItems.first().testShoppingCartId === testShoppingCarts.first().id;

    await relation.assign(testShoppingCartItems, testShoppingCarts.first());

    testShoppingCartItems.foreach((item) =>
    {
        if (item[item.relativeAsFk(TestShoppingCart)] !== testShoppingCarts.first().id)
            ret = false;
    });
    return ret;
}

async function relationalGet()
{
    testShoppingCartItems.first().testShoppingCartId = testShoppingCarts.first().id;
    await TestShoppingCartItem.update(testShoppingCartItems.first());

    const item = (await relation.relationalGet(testShoppingCarts.first()));

    return testShoppingCartItems.first().id === item.id;
}

async function relationalFind()
{
    testShoppingCartItems.foreach((item) => { item[item.relativeAsFk(TestShoppingCart)] = testShoppingCarts.first().id });
    testShoppingCartItems.first().testShoppingCartId = testShoppingCarts.get(1).id;
    await TestShoppingCartItem.update(testShoppingCartItems);
    const expectedSublist = testShoppingCartItems;

    const result = await relation.relationalFind(testShoppingCarts);

    return result.equals(expectedSublist);
}

async function differentColumnName()
{
    const testShoppingCartItem = testShoppingCartItems.first();

    await testShoppingCartDiffColName.assignAndLink(testShoppingCartItem);

    const retrievedTestShoppingCartItem = (await testShoppingCartDiffColName.testShoppingCartItemQ().find()).firstOrNull();

    if (retrievedTestShoppingCartItem.id !== testShoppingCartItem.id)
    {
        console.log('first if');
        console.log('retrievedTestShoppingCartItem', retrievedTestShoppingCartItem);
        console.log('testShoppingCartItem', testShoppingCartItem);
        return false;
    }

    await testShoppingCartItem.load('aCart');

    if (!testShoppingCartItem.aCart)
    {
        console.log('second if');
        console.log(testShoppingCartItem);
        return false;
    }

    return true;
}