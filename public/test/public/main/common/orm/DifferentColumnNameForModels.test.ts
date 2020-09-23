import AHoldsReferenceToB from "../../../../../main/common/orm/AHoldsReferenceToB";
import ManyToOne from "../../../../../main/common/orm/ManyToOne";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartDiffColName from "./testData/TestShoppingCartDiffColName";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";

const PATH = 'test/public/main/common/orm/DifferentColumnNameForModels.test.ts';

let testShoppingCartsDiffColName: List<TestShoppingCartDiffColName>;
let testShoppingCartItems: List<TestShoppingCartItem>;

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "aHoldsReferenceToB", truthly(), aHoldsReferenceToB));
    tests.add(new Test(PATH, "aHoldsNoReferenceToB", truthly(), aHoldsNoReferenceToB));

    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}

async function beforeEach()
{
    testShoppingCartsDiffColName = TestShoppingCartDiffColName.dummies(TestShoppingCartDiffColName, 5);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    await WixDatabase.create(testShoppingCartsDiffColName);
    await WixDatabase.create(testShoppingCartItems);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function aHoldsReferenceToB()
{
    const testShoppingCartDiffColName = testShoppingCartsDiffColName.first();
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

    return true;
}

async function aHoldsNoReferenceToB()
{

    const testShoppingCartDiffColName = testShoppingCartsDiffColName.first();
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

    return true;
}