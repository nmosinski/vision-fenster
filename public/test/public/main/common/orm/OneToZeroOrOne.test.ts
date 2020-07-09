import TestShoppingCart from "./testData/TestShoppingCart.js";
import TestShoppingCartItem from "./testData/TestShoppingCartItem.js";
import TestUser from "./testData/TestUser.js";
import WixDatabase from "../../../../../main/common/orm/WixDatabase.js";

let shoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
let shoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCart, 5);
let users = TestUser.dummies(TestUser, 2);

beforeEach(()=>{
    WixDatabase.storeMultiple(users);
    WixDatabase.storeMultiple(shoppingCartItems);
    WixDatabase.storeMultiple(users);
});

afterEach(()=>{
    WixDatabase.removeAll(TestUser);
    WixDatabase.removeAll(TestShoppingCart);
    WixDatabase.removeAll(TestShoppingCartItem);
});

//test("Direct find")