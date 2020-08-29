import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase, { Query } from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import List from "../../../../../main/common/util/collections/list/List";
import InvalidOperationError from "../../../../../main/common/util/error/InvalidOperationError";
import QueryResult from "../../../../../main/common/orm/QueryResult";
const PATH = "test/public/main/common/orm/AbstractModel.test.js"

var testShoppingCarts: QueryResult<TestShoppingCart>;
var testShoppingCartItems: QueryResult<TestShoppingCartItem>;
var testUsers: QueryResult<TestUser>;

export async function runAllTests() {
    let tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    /*
    tests.add(new Test(PATH, "link", truthly(), link));
    tests.add(new Test(PATH, "assign", truthly(), assign));

    tests.add(new Test(PATH, "simple get", truthly(), simpleGet));
    tests.add(new Test(PATH, "simple find", truthly(), simpleFind));
    tests.add(new Test(PATH, "simple create", truthly(), simpleCreate));
    tests.add(new Test(PATH, "simple create multiple", truthly(), simpleCreateMultiple));
    tests.add(new Test(PATH, "simple update", value(3), simpleUpdate));
    tests.add(new Test(PATH, "simple update multiple", truthly(), simpleUpdateMultiple));
    tests.add(new Test(PATH, "simple save", truthly(), simpleSave));
    tests.add(new Test(PATH, "simple save multiple", truthly(), simpleSaveMultiple));
    tests.add(new Test(PATH, "simple destroy", truthly(), simpleDestroy));
    tests.add(new Test(PATH, "simple destroy multiple", truthly(), simpleDestroyMultiple));

    tests.add(new Test(PATH, "one generation get", truthly(), oneGenerationGet));
    tests.add(new Test(PATH, "one generation find", truthly(), oneGenerationFind));
    tests.add(new Test(PATH, "one generation load", truthly(), oneGenerationLoad));
    tests.add(new Test(PATH, "one generation load multiple", truthly(), oneGenerationLoadMultiple));
    */
    tests.add(new Test(PATH, "one generation create", truthly(), oneGenerationCreate));
    /*tests.add(new Test(PATH, "one generation create multiple", truthly(), oneGenerationCreateMultiple));
    tests.add(new Test(PATH, "one generation update", truthly(), oneGenerationUpdate));
    tests.add(new Test(PATH, "one generation update multiple", truthly(), oneGenerationUpdateMultiple));
    tests.add(new Test(PATH, "one generation save", truthly(), oneGenerationSave));
    tests.add(new Test(PATH, "one generation save multiple", truthly(), oneGenerationSaveMultiple));
    tests.add(new Test(PATH, "one generation destroy", truthly(), oneGenerationDestroy));
    tests.add(new Test(PATH, "one generation destroy multiple", truthly(), oneGenerationDestroyMultiple));

    tests.add(new Test(PATH, "two generations get", truthly(), twoGenerationsGet));
    tests.add(new Test(PATH, "two generations find", truthly(), twoGenerationsFind));
    tests.add(new Test(PATH, "two generations find result as property", truthly(), twoGenerationsFindResultAsProperty));

    /*
    tests.add(new Test(PATH, "two generations load", truthly(), twoGenerationsLoad));
    tests.add(new Test(PATH, "two generations create", truthly(), twoGenerationsCreate));
    tests.add(new Test(PATH, "two generations create multiple", truthly(), twoGenerationsCreateMultiple));
    tests.add(new Test(PATH, "two generations update", value(3), twoGenerationsUpdate));
    tests.add(new Test(PATH, "two generations update multiple", truthly(), twoGenerationsUpdateMultiple));
    tests.add(new Test(PATH, "two generations save", truthly(), twoGenerationsSave));
    tests.add(new Test(PATH, "two generations save multiple", truthly(), twoGenerationsSaveMultiple));
    tests.add(new Test(PATH, "two generations destroy", unspecified(), twoGenerationsDestroy));
    tests.add(new Test(PATH, "two generations destroy multiple", truthly(), twoGenerationsDestroyMultiple));
    */

    await tests.runAll();
}

async function beforeAll() {
    await afterEach();
}

async function beforeEach() {
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    testUsers = TestUser.dummies(TestUser, 2);
    testShoppingCartItems.first().link(testShoppingCarts.first());
    testShoppingCartItems.get(1).link(testShoppingCarts.first());
    testShoppingCarts.first().link(testUsers.first());

    await WixDatabase.create(testShoppingCarts);
    await WixDatabase.create(testShoppingCartItems);
    await WixDatabase.create(testUsers);
}

async function afterEach() {
    await WixDatabase.removeAll(TestUser);
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

function link() {
    let ret = true;

    testShoppingCartItems.last().link(testShoppingCarts.last());
    if (testShoppingCartItems.last()[TestShoppingCart.asFk(TestShoppingCart)] !== testShoppingCarts.last().id) {
        console.log(testShoppingCartItems, "testShoppingCartItems");
        console.log(testShoppingCarts, "testShoppingCarts");
        console.log("first if");
        return false;
    }
    testShoppingCartItems.foreach((item) => { item.link(testShoppingCarts.last()); });

    testShoppingCartItems.foreach((testShoppingCartItem) => {
        if (testShoppingCartItem[TestShoppingCart.asFk(TestShoppingCart)] !== testShoppingCarts.last().id) {
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });
    return ret;
}

function assign() {
    let ret = true;

    testShoppingCartItems.last().link(testShoppingCarts.last());
    testShoppingCartItems.last().assign(testShoppingCarts.last());
    if (testShoppingCartItems.last()["testShoppingCart"] !== testShoppingCarts.last()) {
        console.log(testShoppingCartItems, "testShoppingCartItems");
        console.log(testShoppingCarts, "testShoppingCarts");
        console.log("first if");
        return false;
    }
    testShoppingCartItems.foreach((item) => { item.link(testShoppingCarts.last()); });
    testShoppingCartItems.foreach((item) => { item.assign(testShoppingCarts.last()); });

    testShoppingCartItems.foreach((testShoppingCartItem) => {
        if (testShoppingCartItem["testShoppingCart"] !== testShoppingCarts.last()) {
            console.log(testShoppingCartItem, "testShoppingCartItem");
            console.log(testShoppingCarts.last(), "testShoppingCart");
            ret = false;
        }
    });
    return ret;
}

async function simpleGet() {
    let result = await AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart);
    if (result)
        return result.id === testShoppingCarts.first().id;
    else
        return result;
}

async function simpleFind() {
    let result = await AbstractModel.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleCreate() {
    let shoppingCart = TestShoppingCart.dummy(TestShoppingCart);
    await shoppingCart.create();
    let result = await TestShoppingCart.get(shoppingCart.id, TestShoppingCart);
    return result;
}

async function simpleCreateMultiple() {
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.create(testShoppingCartItems);
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    if (!result.equals(testShoppingCartItems)) {
        console.log("result", result);
        console.log("testShoppingCartItems", testShoppingCartItems);
        return false;
    }
    return true;
}

async function simpleUpdate() {
    let item = await TestShoppingCartItem.get(testShoppingCartItems.first().id, TestShoppingCartItem);
    if (!item)
        throw new InvalidOperationError(PATH, "simpleUpdate", "Wrong test configuration or get doesn't work like expected!");

    item.count = 3;
    await item.update();
    let updatedItem = await TestShoppingCartItem.get(item.id, TestShoppingCartItem);
    if (!updatedItem)
        throw new InvalidOperationError(PATH, "simpleUpdate", "Wrong test configuration or get doesn't work like expected!");

    return updatedItem.count;
}

async function simpleUpdateMultiple() {
    let ret = true;
    let items = await TestShoppingCartItem.find(TestShoppingCartItem);
    items.foreach((item) => { item.count = 3; });
    await TestShoppingCartItem.update(items);
    let updatedItems = await TestShoppingCartItem.find(TestShoppingCartItem);
    updatedItems.foreach((item) => {
        if (item.count !== 3)
            ret = false;
    });
    return ret;
}

async function simpleSave() {
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.save(testShoppingCartItems.first());
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.has(testShoppingCartItems.first());
}

async function simpleSaveMultiple() {
    await WixDatabase.removeAll(TestShoppingCartItem);
    await TestShoppingCartItem.save(testShoppingCartItems);
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleDestroy() {
    await TestUser.destroy(testUsers.first());
    if (await (TestUser.exists(testUsers.first().id, TestUser)))
        return false;
    return true;
}

async function simpleDestroyMultiple() {
    await TestUser.destroy(testUsers);
    let result = await TestUser.find(TestUser);
    return result.isEmpty();
}


async function oneGenerationGet() {
    let result = await testShoppingCarts.first().testShoppingCartItemsQ().get();

    if (result)
        return result.id === testShoppingCartItems.first().id;
    else
        return result;
}

async function oneGenerationLoad() {
    await testUsers.first().load(TestShoppingCart);

    if (testUsers.first().testShoppingCart.id !== testShoppingCarts.first().id) {
        console.log("testUsers", testUsers);
        console.log("first if");
        return false;
    }


    await testShoppingCarts.first().load(TestShoppingCartItem);
    if (!testShoppingCarts.first().testShoppingCartItems.equals(new List([testShoppingCartItems.first(), testShoppingCartItems.get(1)]))) {
        console.log("testShoppingCarts", testShoppingCarts);
        console.log("second if");
        return false;
    }

    return true;
}

async function oneGenerationLoadMultiple() {
    await testUsers.load(TestShoppingCart);

    if (testUsers.first().testShoppingCart.id !== testShoppingCarts.first().id) {
        console.log("testUsers", testUsers);
        console.log("first if");
        return false;
    }


    await testShoppingCarts.first().load(TestShoppingCartItem);
    if (!testShoppingCarts.first().testShoppingCartItems.equals(new List([testShoppingCartItems.first(), testShoppingCartItems.get(1)]))) {
        console.log("testShoppingCarts", testShoppingCarts);
        console.log("second if");
        return false;
    }

    return true;
}

async function oneGenerationFind() {
    let result = await testShoppingCarts.first().testShoppingCartItemsQ().find();

    if (result) {
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

async function oneGenerationCreate() {
    let item = TestShoppingCartItem.dummy(TestShoppingCartItem);
    await item.create(testShoppingCarts.last());
    console.log("item", item);
    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();
    console.log("result", result);

    if (!result.has(item))
        return false;
    return true;
}

async function oneGenerationCreateMultiple() {
    let ret = true;
    let items = TestShoppingCartItem.dummies(TestShoppingCartItem, 3);
    await testShoppingCarts.last().testShoppingCartItemsQ().create(items);

    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();

    items.foreach((item) => {
        if (!result.has(item))
            ret = false;
    });

    return ret;
}

async function oneGenerationUpdate() {
    let item = TestShoppingCartItem.dummy(TestShoppingCartItem);
    await testShoppingCarts.last().testShoppingCartItemsQ().create(item);

    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();

    if (!result.has(item))
        return false;
    return true;
}

async function oneGenerationUpdateMultiple() {
    let ret = true;
    let items = TestShoppingCartItem.dummies(TestShoppingCartItem, 3);
    await testShoppingCarts.last().testShoppingCartItemsQ().create(items);

    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();

    items.foreach((item) => {
        if (!result.has(item))
            ret = false;
    });

    return ret;
}

async function oneGenerationSave() {
    let item = TestShoppingCartItem.dummy(TestShoppingCartItem);
    await testShoppingCarts.last().testShoppingCartItemsQ().create(item);

    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();

    if (!result.has(item))
        return false;
    return true;
}

async function oneGenerationSaveMultiple() {
    let ret = true;
    let items = TestShoppingCartItem.dummies(TestShoppingCartItem, 3);
    await testShoppingCarts.last().testShoppingCartItemsQ().create(items);

    let result = await testShoppingCarts.last().testShoppingCartItemsQ().find();

    items.foreach((item) => {
        if (!result.has(item))
            ret = false;
    });

    return ret;
}

async function oneGenerationDestroy() {
    await testShoppingCarts.first().testShoppingCartItemsQ().destroy();
    let items = await testShoppingCarts.first().testShoppingCartItemsQ().find();

    return items.length === 0;
}

async function oneGenerationDestroyMultiple() {
    await testShoppingCarts.first().testShoppingCartItemsQ().destroy();
    let items = await testShoppingCarts.first().testShoppingCartItemsQ().find();

    return items.length === 0;
}


async function twoGenerationsGet() {
    let result = await testUsers.first().testShoppingCartQ().testShoppingCartItemsQ().get();

    if (result)
        return result.id === testShoppingCartItems.first().id;
    else
        return result;
}

async function twoGenerationsFind() {
    let result = await testUsers.first().testShoppingCartQ().testShoppingCartItemsQ().find();

    if (result) {
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


async function twoGenerationsFindResultAsProperty() {
    let result = await testUsers.first().testShoppingCartQ().testShoppingCartItemsQ().find();

    if (result) {
        if (!(testUsers.first().testShoppingCart.id === testShoppingCarts.first().id))
            return false;
        if (!(testUsers.first().testShoppingCart.testShoppingCartItems.first().id === testShoppingCartItems.first().id))
            return false;
        return true;
    }
    else
        return result;
}