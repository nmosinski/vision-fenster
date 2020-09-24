import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsReferenceToB from "../../../../../main/common/orm/AHoldsReferenceToB";
import ManyToOne from "../../../../../main/common/orm/ManyToOne";
import TestShoppingCartDiffColName from "./testData/TestShoppingCartDiffColName";
const PATH = "test/public/main/common/orm/AHoldsReferenceToB.test.js"

let testShoppingCarts: List<TestShoppingCart>;
let testShoppingCartItems: List<TestShoppingCartItem>;
let testShoppingCartDiffColName: TestShoppingCartDiffColName;
let relation: AHoldsReferenceToB<TestShoppingCartItem, TestShoppingCart>;

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational destroy multiple", truthly(), relationalDestroyMultiple));
    tests.add(new Test(PATH, "different column name", truthly(), differentColumnName));

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
    testShoppingCartDiffColName = TestShoppingCartDiffColName.dummy(TestShoppingCartDiffColName);
    await WixDatabase.create(testShoppingCarts);
    await WixDatabase.create(testShoppingCartItems);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function relationalGet()
{
    testShoppingCartItems.first().testShoppingCartId = testShoppingCarts.first().id;
    const item = (await relation.relationalGet(testShoppingCartItems.first()));

    return testShoppingCarts.first().id === item.id;
}

async function relationalFind()
{
    testShoppingCartItems.foreach((item) => { item[item.relativeAsFk(TestShoppingCart)] = testShoppingCarts.first().id });
    testShoppingCartItems.first().testShoppingCartId = testShoppingCarts.get(1).id;
    const expectedSublist = testShoppingCarts.sublist(0, 1);
    const result = await relation.relationalFind(testShoppingCartItems);

    return result.equals(expectedSublist);
}

async function relationalDestroy()
{
    testShoppingCartItems.foreach((testShoppingCartItem) =>
    {
        testShoppingCartItem[testShoppingCartItem.relativeAsFk(TestShoppingCart)] = testShoppingCarts.first().id;
    });
    testShoppingCartItems.last().testShoppingCartId = "None";

    await WixDatabase.update(testShoppingCartItems);

    await relation.inverse().relationalDestroy(testShoppingCarts.first());
    const items = await WixDatabase.query(TestShoppingCartItem).execute();

    if (!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;

    return true;
}

async function relationalDestroyMultiple()
{
    for (let idx = 0; idx < testShoppingCartItems.length; idx++)
        testShoppingCartItems.get(idx).testShoppingCartId = testShoppingCarts.get(idx).id;
    testShoppingCartItems.last().testShoppingCartId = "None";

    await WixDatabase.update(testShoppingCartItems);

    await relation.inverse().relationalDestroy(testShoppingCarts);
    const items = await WixDatabase.query(TestShoppingCartItem).execute();

    if (!(items.length === 1 && items.first().id === testShoppingCartItems.last().id))
        return false;
    return true;
}

async function differentColumnName()
{
    const testShoppingCartItem = testShoppingCartItems.first();

    await testShoppingCartDiffColName.assignAndLink(testShoppingCartItem);

    const retrievedTestShoppingCartDiffColName = (await testShoppingCartItem.testShoppingCartDiffColNameQ().find()).firstOrNull();

    if (testShoppingCartDiffColName.id !== retrievedTestShoppingCartDiffColName.id)
    {
        console.log('first if');
        console.log('retrievedTestShoppingCartDiffColName', retrievedTestShoppingCartDiffColName);
        console.log('testShoppingCartDiffColName', testShoppingCartDiffColName);
        return false;
    }

    await testShoppingCartDiffColName.load('aCartItem');

    if (!testShoppingCartDiffColName.aCartItems)
    {
        console.log('second if');
        console.log(testShoppingCartDiffColName);
        return false;
    }

    return true;
}