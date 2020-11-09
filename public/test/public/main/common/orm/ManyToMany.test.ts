import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import TestTag from "./testData/TestTag";
// @ts-ignore
import wixData from "wix-data"
import QueryResult from "../../../../../main/common/orm/QueryResult";
import JsTypes from "../../../../../main/common/util/jsTypes/JsTypes";
import AbstractStorableModel from "../../../../../main/common/orm/AbstractStorableModel";
import WixDatabase from "../../../../../extern/wix/common/persistance/WixDatabase";
import Storage from "../../../../../main/common/persistance/model/Storage";
const PATH = "test/public/main/common/orm/ManyToMany.test.js"

let testShoppingCartItems: QueryResult<TestShoppingCartItem>;
let testTags: QueryResult<TestTag>;
const wixDatabase = new Storage(new WixDatabase());

export async function runAllTests()
{
    const tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational link", truthly(), relationalLink));
    tests.add(new Test(PATH, "relational assign", truthly(), relationalAssign));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational load", truthly(), relationalLoad));

    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}

async function beforeEach()
{
    testTags = new QueryResult(TestTag.dummies(TestTag, 5));
    testShoppingCartItems = new QueryResult(TestShoppingCartItem.dummies(TestShoppingCartItem, 5));
    await wixDatabase.create(testTags, testTags.tableName);
    await wixDatabase.create(testShoppingCartItems, testShoppingCartItems.tableName);

    // the first shopping cart item has all tags / each tag has the first shopping cart
    const roleItems: object[] = [];
    testTags.foreach((tag: TestTag) =>
    {
        roleItems.push({
            "testTagId": tag.id,
            "testShoppingCartItemId": testShoppingCartItems.first().id
        });
    });

    await wixData.bulkInsert("RoleTestShoppingCartItemTestTag", roleItems);
    // the last shopping cart item has the last tag / the last tag belongs to the last shopping cart
    await wixData.insert("RoleTestShoppingCartItemTestTag", {
        "testTagId": testTags.last().id,
        "testShoppingCartItemId": testShoppingCartItems.last().id
    });
}

async function afterEach()
{
    await wixDatabase.truncate(TestTag.tableName(TestTag));
    await wixDatabase.truncate(TestShoppingCartItem.tableName(TestShoppingCartItem));
    await wixDatabase.truncate("RoleTestShoppingCartItemTestTag");
}


async function relationalGet()
{
    const testShippingCartItem = testShoppingCartItems.first();
    const testShoppingCartItem2 = await AbstractStorableModel.get(testShippingCartItem.id, TestShoppingCartItem);
    if (!testShoppingCartItem2)
    {
        console.log("testShoppingCartItem2", testShoppingCartItem2);
        console.log("first if");
        return false;
    }

    if (testShippingCartItem.id !== testShoppingCartItem2.id)
    {
        console.log("testShoppingCartItem", testShippingCartItem);
        console.log("testShoppingCartItem2", testShoppingCartItem2);
        console.log("second if");
        return false;
    }

    return true;
}

async function relationalLink()
{
    await testShoppingCartItems.link(testTags);
    const tags = await testShoppingCartItems.get(0).testTagsQ().find();
    if (!tags.equals(testTags))
    {
        console.log("tags", tags);
        console.log("testTags", testTags);
        console.log("first if");
        return false;
    }
    return true;
}

async function relationalAssign()
{
    await testShoppingCartItems.assign(testTags);
    await testShoppingCartItems.link(testTags);

    const tags = testShoppingCartItems.get(1).testTags;
    if (!tags || !tags.equals(testTags))
    {
        console.log("tags", tags);
        console.log("testTags", testTags);
        console.log("testShoppingCartItems", testShoppingCartItems);
        console.log("first if");
        return false;
    }
    return true;
}

async function relationalFind()
{
    const result = await testShoppingCartItems.first().testTagsQ().find();
    if (!result.equals(testTags))
    {
        console.log('first if');
        console.log(result, 'result');
    }

    const result2 = await testShoppingCartItems.last().testTagsQ().find();
    if (result2.length !== 1 || !result2.first().equals(testTags.last()))
    {
        console.log('second if');
        console.log(result2, 'result2');
    }
    return true;
}

async function relationalDestroy()
{
    new TestTag().testShoppingCartItemsQ();

    await testTags.last().destroy();

    const resultAfterDestroy = await testTags.last().testShoppingCartItemsQ().find();

    if (!resultAfterDestroy.isEmpty())
    {
        console.log('first if');
        console.log(testTags.last(), 'testTag');
        console.log(resultAfterDestroy, 'result after destroy');
        return false;
    }

    return true;
}

async function relationalLoad()
{
    const tags = new QueryResult<TestTag>(testTags);
    await tags.load(TestShoppingCartItem);

    let ret = true;
    tags.foreach((tag) =>
    {
        if (JsTypes.isUnspecified(tag.testShoppingCartItems))
        {
            ret = false;
            console.log("Tag: ", tag);
        }
    });

    return ret;
}