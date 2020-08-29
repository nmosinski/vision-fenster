import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value } from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import AHoldsNoReferenceToB from "../../../../../main/common/orm/AHoldsNoReferenceToB";
import OneToMany from "../../../../../main/common/orm/OneToMany";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import JsTypes from "../../../../../main/common/util/jsTypes/JsTypes";
const PATH = "test/public/main/common/orm/NotManyToMany.test.js"

var testShoppingCarts: List<TestShoppingCart>;
var testShoppingCartItems: List<TestShoppingCartItem>;
var relation: AHoldsNoReferenceToB<TestShoppingCart, TestShoppingCartItem>;

export async function runAllTests() {
    let tests = new Tests(beforeAll, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "relational load", truthly(), relationalLoad));

    await tests.runAll();
}

async function beforeAll() {
    relation = new OneToMany<TestShoppingCart, TestShoppingCartItem>(TestShoppingCart, TestShoppingCartItem);
    await afterEach();
}

async function beforeEach() {
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 5);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    await WixDatabase.create(testShoppingCarts);
    await WixDatabase.create(testShoppingCartItems);
}

async function afterEach() {
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function relationalLoad() {
    let carts = new QueryResult<TestShoppingCart>(testShoppingCarts);
    await carts.load(TestShoppingCartItem);

    let ret = true;
    carts.foreach((cart) => {
        if (JsTypes.isUnspecified(cart.testShoppingCartItems)) {
            ret = false;
            console.log("Carts: ", carts);
        }
    });

    return ret;
}