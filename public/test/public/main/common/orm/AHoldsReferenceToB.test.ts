// @ts-nocheck
/* eslint-disable */
import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsReferenceToB from "../../../../../main/common/orm/AHoldsReferenceToB";
import ManyToOne from "../../../../../main/common/orm/ManyToOne";
import Storage from "../../../../../main/common/persistance/model/Storage";
import WixDatabase from "../../../../../extern/wix/common/persistance/WixDatabase";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import AbstractStorableModel from "../../../../../main/common/orm/AbstractStorableModel";
const PATH = "test/public/main/common/orm/AHoldsReferenceToB.test.js"

let testShoppingCarts: QueryResult<TestShoppingCart>;
let testShoppingCartItems: QueryResult<TestShoppingCartItem>;
let relation: AHoldsReferenceToB<TestShoppingCartItem, TestShoppingCart>;
const wixDatabase = new Storage(new WixDatabase());



export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

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
    testShoppingCarts = new QueryResult(TestShoppingCart.dummies(TestShoppingCart, 5));
    testShoppingCartItems = new QueryResult(TestShoppingCartItem.dummies(TestShoppingCartItem, 5));
    await wixDatabase.create(testShoppingCarts, testShoppingCarts.tableName);
    await wixDatabase.create(testShoppingCartItems, testShoppingCartItems.tableName);
}

async function afterEach()
{
    await wixDatabase.truncate(TestShoppingCart.tableName(TestShoppingCart));
    await wixDatabase.truncate(AbstractStorableModel.tableName(TestShoppingCartItem));
}

async function relationalGet()
{
    testShoppingCartItems.first()[testShoppingCarts.first().asFk()] = testShoppingCarts.first().id;
    const item = (await relation.relationalGet(testShoppingCartItems.first()));

    return testShoppingCarts.first().id === item.id;
}

async function relationalFind()
{
    testShoppingCartItems.foreach((item) => { item[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.first().id });
    testShoppingCartItems.first()[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.get(1).id;
    const expectedSublist = testShoppingCarts.sublist(0, 1);
    const result = await relation.relationalFind(testShoppingCartItems);

    return result.equals(expectedSublist);
}

async function relationalDestroy()
{
    testShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        testShoppingCartItem[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.first().id;
    });
    testShoppingCartItems.last()[TestShoppingCart.asFk(TestShoppingCart)] = "None";

    await wixDatabase.update(testShoppingCartItems, testShoppingCartItems.tableName);

    await relation.inverse().relationalDestroy(testShoppingCarts.first());
    const items = await wixDatabase.query(new TestShoppingCartItem().tableName).execute();

    if (!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;

    return true;
}

async function relationalDestroyMultiple()
{
    for (let idx = 0; idx < testShoppingCartItems.length; idx++)
        testShoppingCartItems.get(idx)[TestShoppingCart.asFk(TestShoppingCart)] = testShoppingCarts.get(idx).id;
    testShoppingCartItems.last()[TestShoppingCart.asFk(TestShoppingCart)] = "None";

    await wixDatabase.update(testShoppingCartItems, testShoppingCartItems.tableName);

    await relation.inverse().relationalDestroy(testShoppingCarts);
    const items = await wixDatabase.query(AbstractStorableModel.tableName(TestShoppingCartItem)).execute();

    if (!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;
    return true;
}