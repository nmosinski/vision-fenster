import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import TestTag from "./testData/TestTag";
// @ts-ignore
import wixData from "wix-data"
import ManyToMany from "../../../../../main/common/orm/ManyToMany";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import JsTypes from "../../../../../main/common/util/jsTypes/JsTypes";
const PATH = "test/public/main/common/orm/ManyToMany.test.js"

var testShoppingCartItems: List<TestShoppingCartItem>;
var testTags: List<TestTag>;

export async function runAllTests() {
    let tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    //tests.add(new Test(PATH, "relational link", truthly(), relationalLink));
    //tests.add(new Test(PATH, "relational link multiple", truthly(), relationalLinkMultiple));
    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational destroy multiple", truthly(), relationalDestroyMultiple));
    tests.add(new Test(PATH, "relational load", truthly(), relationalLoad));

    await tests.runAll();
}

async function beforeAll() {
    await afterEach();
}

async function beforeEach() {
    testTags = TestTag.dummies(TestTag, 5);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    await WixDatabase.createMultiple(testTags);
    await WixDatabase.createMultiple(testShoppingCartItems);

    // the first shopping cart item has all tags / each tag has the first shopping cart
    let roleItems: Array<object> = [];
    testTags.foreach((tag: TestTag) => {
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

async function afterEach() {
    await WixDatabase.removeAll(TestTag);
    await WixDatabase.removeAll(TestShoppingCartItem);
    await wixData.truncate("RoleTestShoppingCartItemTestTag");
}

async function relationalGet() {
    let item = await testShoppingCartItems.first().testTagsQ().get();
    if (!item)
        return false;

    return testTags.first().id === item.id;
}

async function relationalFind() {
    let result = await testShoppingCartItems.first().testTagsQ().find();
    return result.equals(testTags);
}

async function relationalDestroy() {
    new TestTag().testShoppingCartItemsQ();

    let resultBeforeDestroy = await testTags.last().testShoppingCartItemsQ().find();
    if (!(resultBeforeDestroy.has(testShoppingCartItems.first()) && resultBeforeDestroy.has(testShoppingCartItems.last()) && resultBeforeDestroy.length === 2))
        return false;

    let roleTestTableBeforeDestr = await wixData.query("RoleTestShoppingCartItemTestTag").find();
    await testTags.last().destroy();

    let roleTestTableAfterDestr = await wixData.query("RoleTestShoppingCartItemTestTag").find();

    let resultAfterDestroy = await testTags.last().testShoppingCartItemsQ().find();
    if (!resultAfterDestroy.isEmpty())
        return false;

    return true;
}

async function relationalDestroyMultiple() {
    let resultOfLastBeforeDestroy = await testTags.last().testShoppingCartItemsQ().find();
    if (!(resultOfLastBeforeDestroy.has(testShoppingCartItems.first()) && resultOfLastBeforeDestroy.has(testShoppingCartItems.last()) && resultOfLastBeforeDestroy.length === 2))
        return false;

    let resultOfFirstBeforeDestroy = await testTags.first().testShoppingCartItemsQ().find();
    if (resultOfFirstBeforeDestroy.first().id !== testShoppingCartItems.first().id)
        return false;

    await TestShoppingCartItem.destroyMultiple(testShoppingCartItems);
    let resultOfLastAfterDestroy = await testTags.last().testShoppingCartItemsQ().find();
    if (!resultOfLastAfterDestroy.isEmpty())
        return false;

    let resultOfFirstAfterDestroy = await testTags.first().testShoppingCartItemsQ().find();
    if (!resultOfFirstAfterDestroy.isEmpty())
        return false;

    return true;
}

async function relationalLoad() {
    let cartItems = new QueryResult<TestShoppingCartItem>(testShoppingCartItems);
    await cartItems.load(TestTag);

    let ret = true;
    cartItems.foreach((item) => {
        if (JsTypes.isUnspecified(item.testTags)) {
            ret = false;
            console.log("CartItems: ", cartItems);
        }
    });

    return ret;
}