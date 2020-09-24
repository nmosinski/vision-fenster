import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import InvalidOperationError from "../../../../../main/common/util/error/InvalidOperationError";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import JsTypes from "../../../../../main/common/util/jsTypes/JsTypes";
const PATH = "test/public/main/common/orm/AbstractModel.test.js"
// @ts-ignore
import wixData from 'wix-data';

let testShoppingCarts: QueryResult<TestShoppingCart>;
let testShoppingCartItems: QueryResult<TestShoppingCartItem>;
let testUsers: QueryResult<TestUser>;

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "assign", truthly(), assign));
    tests.add(new Test(PATH, "link", truthly(), link));
    tests.add(new Test(PATH, "assign and link", truthly(), assignAndLink));
    tests.add(new Test(PATH, "reduce", truthly(), reduce));
    tests.add(new Test(PATH, "strip", truthly(), strip));

    tests.add(new Test(PATH, "simple get", truthly(), simpleGet));
    tests.add(new Test(PATH, "simple find", truthly(), simpleFind));
    tests.add(new Test(PATH, "simple load", truthly(), simpleLoad));
    tests.add(new Test(PATH, "simple loadMultiple", truthly(), simpleLoadMultiple));
    tests.add(new Test(PATH, "simple load chain", truthly(), simpleLoadChain));
    tests.add(new Test(PATH, "simple create", truthly(), simpleCreate));
    tests.add(new Test(PATH, "simple create multiple", truthly(), simpleCreateMultiple));
    tests.add(new Test(PATH, "simple update", value(3), simpleUpdate));
    tests.add(new Test(PATH, "simple update multiple", truthly(), simpleUpdateMultiple));
    tests.add(new Test(PATH, "simple save", truthly(), simpleSave));
    tests.add(new Test(PATH, "simple save multiple", truthly(), simpleSaveMultiple));
    tests.add(new Test(PATH, "simple destroy", truthly(), simpleDestroy));
    tests.add(new Test(PATH, "simple destroy multiple", truthly(), simpleDestroyMultiple));

    tests.add(new Test(PATH, "one generation find", truthly(), oneGenerationFind));
    tests.add(new Test(PATH, "one generation find result as Property", truthly(), oneGenerationFindResultAsProperty));

    tests.add(new Test(PATH, "two generations find", truthly(), twoGenerationsFind));
    tests.add(new Test(PATH, "two generations find result as property", truthly(), twoGenerationsFindResultAsProperty));

    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}

async function beforeEach()
{
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    testUsers = TestUser.dummies(TestUser, 2);
    await testShoppingCartItems.first().assign(testShoppingCarts.first());
    await testShoppingCartItems.get(1).assign(testShoppingCarts.first());
    await testShoppingCarts.first().assign(testUsers.first());

    await WixDatabase.create(testShoppingCarts);
    await WixDatabase.create(testShoppingCartItems);
    await WixDatabase.create(testUsers);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestUser);
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function assign()
{
    let ret = true;

    await testShoppingCartItems.last().assign(testShoppingCarts.last());
    if (testShoppingCartItems.last().testShoppingCartId !== testShoppingCarts.last().id)
    {
        console.log('first if');
        console.log(testShoppingCartItems, "testShoppingCartItems");
        console.log(testShoppingCarts, "testShoppingCarts");
        return false;
    }

    await testShoppingCartItems.assign(testShoppingCarts.last());

    testShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        if (testShoppingCartItem.testShoppingCartId !== testShoppingCarts.last().id)
        {
            console.log('second if');
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });

    const dbTestShoppingCartItems = await AbstractModel.find(TestShoppingCartItem);

    dbTestShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        if (testShoppingCartItem[testShoppingCartItem.relativeAsFk(TestShoppingCart)] !== testShoppingCarts.last().id)
        {
            console.log('third if');
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });

    return ret;
}

async function link()
{
    let ret = true;

    await testShoppingCartItems.last().assign(testShoppingCarts.last());
    await testShoppingCartItems.last().link(testShoppingCarts.last());
    if (testShoppingCartItems.last()["testShoppingCart"] !== testShoppingCarts.last())
    {
        console.log(testShoppingCartItems, "testShoppingCartItems");
        console.log(testShoppingCarts, "testShoppingCarts");
        console.log("first if");
        return false;
    }
    await testShoppingCartItems.foreachAsync(async (item) => { await item.assign(testShoppingCarts.last()); });
    await testShoppingCartItems.foreachAsync(async (item) => { await item.link(testShoppingCarts.last()); });


    testShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        if (testShoppingCartItem["testShoppingCart"] !== testShoppingCarts.last())
        {
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });
    return ret;
}

async function assignAndLink()
{
    let ret = true;

    await testShoppingCartItems.last().assignAndLink(testShoppingCarts.last());
    if (testShoppingCartItems.last()["testShoppingCart"] !== testShoppingCarts.last())
    {
        console.log(testShoppingCartItems, "testShoppingCartItems");
        console.log(testShoppingCarts, "testShoppingCarts");
        console.log("first if");
        return false;
    }
    await testShoppingCartItems.foreachAsync(async (item) => { await item.assignAndLink(testShoppingCarts.last()); });


    testShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        if (testShoppingCartItem["testShoppingCart"] !== testShoppingCarts.last())
        {
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });
    return ret;
}

async function reduce()
{
    let shoppingCart = testShoppingCarts.first();
    shoppingCart.id = '2';
    shoppingCart.count = 2;
    shoppingCart.name = 'Norbert';

    shoppingCart = shoppingCart.reduce('count');

    if (shoppingCart.name || !(shoppingCart instanceof TestShoppingCart))
    {
        console.log('first if');
        console.log(shoppingCart);
        return false;
    }

    shoppingCart.id = '2';
    shoppingCart.count = 2;
    shoppingCart.name = 'Norbert';

    shoppingCart = shoppingCart.reduce('name');

    if (shoppingCart.name !== 'Norbert' || !(shoppingCart instanceof TestShoppingCart))
    {
        console.log('second if');
        console.log(shoppingCart);
        return false;
    }

    return true;
}

async function strip()
{
    const shoppingCart = testShoppingCarts.first();
    shoppingCart.id = '2';
    shoppingCart.count = 2;
    shoppingCart.name = 'Norbert';

    const strippedShoppingCart = shoppingCart.strip('count');

    if (strippedShoppingCart.name || strippedShoppingCart instanceof TestShoppingCart)
    {
        console.log('first if');
        console.log(strippedShoppingCart);
        return false;
    }

    const shoppingCartItem = testShoppingCartItems.last();
    shoppingCartItem.id = '2';
    shoppingCartItem.count = 2;

    const strippedShoppingCartItem = shoppingCartItem.strip();

    if (strippedShoppingCartItem.count !== 2 || strippedShoppingCartItem instanceof TestShoppingCartItem)
    {
        console.log('second if');
        console.log(strippedShoppingCartItem);
        return false;
    }

    return true;
}

async function simpleGet()
{
    const result = await AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart);
    if (result)
        return result.id === testShoppingCarts.first().id;
    else
        return result;
}

async function simpleFind()
{
    const result = await AbstractModel.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleLoad()
{
    await testShoppingCarts.first().load(TestShoppingCartItem);
    if (JsTypes.isUnspecified(testShoppingCarts.first().testShoppingCartItems))
    {
        console.log("testShoppingCart", testShoppingCarts.first());
        console.log("first if");
        return false;
    }
    return true;
}

async function simpleLoadMultiple()
{
    await testShoppingCarts.first().load([TestShoppingCartItem, TestUser]);
    if (JsTypes.isUnspecified(testShoppingCarts.first().testShoppingCartItems))
    {
        console.log("testShoppingCart", testShoppingCarts.first());
        console.log("first if");
        return false;
    }
    if (JsTypes.isUnspecified(testShoppingCarts.first().testUser))
    {
        console.log("testShoppingCart", testShoppingCarts.first());
        console.log("first if");
        return false;
    }
    return true;
}

async function simpleLoadChain()
{
    await testUsers.first().loadChain([TestShoppingCart, TestShoppingCartItem]);
    if (JsTypes.isUnspecified(testUsers.first().testShoppingCart.testShoppingCartItems))
    {
        console.log("testUser", testUsers.first());
        console.log("first if");
        return false;
    }
    return true;
}

async function simpleCreate()
{
    const shoppingCart = TestShoppingCart.dummy(TestShoppingCart);
    await shoppingCart.create();
    const result = await TestShoppingCart.get(shoppingCart.id, TestShoppingCart);
    return result;
}

async function simpleCreateMultiple()
{
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.create(testShoppingCartItems);
    const result = await TestShoppingCartItem.find(TestShoppingCartItem);
    if (!result.equals(testShoppingCartItems))
    {
        console.log("result", result);
        console.log("testShoppingCartItems", testShoppingCartItems);
        return false;
    }
    return true;
}

async function simpleUpdate()
{
    const item = await TestShoppingCartItem.get(testShoppingCartItems.first().id, TestShoppingCartItem);
    if (!item)
        throw new InvalidOperationError(PATH, "simpleUpdate", "Wrong test configuration or get doesn't work like expected!");

    item.count = 3;
    await item.update();

    let updatedItem = await TestShoppingCartItem.get(item.id, TestShoppingCartItem);
    if (!updatedItem || updatedItem.count !== 3)
    {
        console.log('first if');
        console.log(item, 'item');
        console.log(updatedItem, 'updatedItem');
        return false;
    }


    item.count = 4;
    item.price = 7;

    await item.update(['price']);
    updatedItem = await TestShoppingCartItem.get(item.id, TestShoppingCartItem);
    if (updatedItem.price !== 7)
    {
        console.log('second if');
        console.log(item, 'item');
        console.log(updatedItem, 'updatedItem');
        return false;
    }

    return updatedItem.count;
}

async function simpleUpdateMultiple()
{
    let ret = true;
    const items = await TestShoppingCartItem.find(TestShoppingCartItem);
    items.foreach((item) => { item.count = 3; });
    await TestShoppingCartItem.update(items);
    const updatedItems = await TestShoppingCartItem.find(TestShoppingCartItem);
    updatedItems.foreach((item) =>
    {
        if (item.count !== 3)
            ret = false;
    });
    return ret;
}

async function simpleSave()
{
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.save(testShoppingCartItems.first());
    const result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.has(testShoppingCartItems.first());
}

async function simpleSaveMultiple()
{
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.save(testShoppingCartItems);
    const result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleDestroy()
{
    await TestUser.destroy(testUsers.first());
    if (await (TestUser.exists(testUsers.first().id, TestUser)))
        return false;
    return true;
}

async function simpleDestroyMultiple()
{
    await TestUser.destroy(testUsers);
    const result = await TestUser.find(TestUser);
    return result.isEmpty();
}

async function oneGenerationFind()
{
    const result = await testShoppingCarts.first().testShoppingCartItemsQ().find();

    if (result)
    {
        if (result.length !== 2)
            return false;
        if (!result.has(testShoppingCartItems.first()))
            return false;
        if (!result.has(testShoppingCartItems.get(1)))
            return false;
    }
    else
        return result;
    return true;
}

async function oneGenerationFindResultAsProperty()
{
    const result = await testShoppingCarts.first().testShoppingCartItemsQ().find();

    if (result)
    {
        if (testShoppingCarts.first().testShoppingCartItems !== result)
        {
            console.log("testShoppingCarts", testShoppingCarts);
            console.log("result", result);
            console.log("first if");
            return false;
        }
    }
    else
        return result;
    return true;
}

async function twoGenerationsFind()
{
    const result = await testUsers.first().testShoppingCartQ().testShoppingCartItemsQ().find();

    if (result)
    {
        if (result.length !== 2)
            return false;
        if (!result.has(testShoppingCartItems.first()))
            return false;
        if (!result.has(testShoppingCartItems.get(1)))
            return false;
    }
    else
        return result;
    return true;
}


async function twoGenerationsFindResultAsProperty()
{
    const result = await testUsers.first().testShoppingCartQ().testShoppingCartItemsQ().find();

    if (result)
    {
        if (!(testUsers.first().testShoppingCart.id === testShoppingCarts.first().id))
            return false;
        if (!(testUsers.first().testShoppingCart.testShoppingCartItems.first().id === testShoppingCartItems.first().id))
            return false;
        return true;
    }
    else
        return result;
}