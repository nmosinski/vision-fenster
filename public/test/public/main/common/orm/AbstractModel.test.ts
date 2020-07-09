import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, Value} from "../../../../../main/common/test/Test";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import ShoppingCart from "../../../../../main/feature/shoppingCart/model/ShoppingCart";

const PATH = "test/public/main/common/orm/AbstractModel.test.js"

var testShoppingCarts;
var testShoppingCartItems;
var testUsers;

function initTestData()
{
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    testUsers = TestUser.dummies(TestUser, 2);
}

export async function runAllTestss()
{
    initTestData();
 
    let tests = new Tests(beforeEach, afterEach);

    tests.add(new Test(PATH, "simple get", new Value(testShoppingCarts.first().id), simpleGetImplementation));

    await tests.runAll();
}

async function beforeEach()
{
    await WixDatabase.storeMultiple(testShoppingCarts);
    await WixDatabase.storeMultiple(testShoppingCartItems);
    await WixDatabase.storeMultiple(testUsers);
}

async function afterEach()
{
    /*
    await WixDatabase.removeAll(TestUser);
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
    */
}

async function simpleGetImplementation()
{
    let result = await AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart);
    if(result)
        return result.id;
    else
        return result;
}



/*
test("simple get", ()=>{
    AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart).then((result)=>{
        expect(result.id).toBe(testShoppingCarts.first().id);
    });
});

test("simple find", ()=>{
    AbstractModel.find(TestShoppingCartItem).then((result)=>{
        expect(result.equals(testShoppingCartItems)).toBeTruthy();
    });
});

test("simple store", ()=>{
    let shoppingCart = TestShoppingCart.dummy(TestShoppingCart);
    shoppingCart.store().then(()=>{
        TestShoppingCart.get(shoppingCart.id, TestShoppingCart).then((result)=>{
            expect(result).toBeTruthy();
        });
    });
});

test("simple storeMultiple", ()=>{
    WixDatabase.removeAll(TestShoppingCartItem).then(()=>{    
        TestShoppingCartItem.storeMultiple(testShoppingCartItems).then(()=>{
            TestShoppingCartItem.find(TestShoppingCartItem).then((result)=>{
                expect(result.equals(testShoppingCartItems)).toBeTruthy();
            });
        });
    });
});

test("simple update", ()=>{
    TestShoppingCartItem.get(testShoppingCartItems.first().id, TestShoppingCartItem).then((shoppingCartItem)=>{
        shoppingCartItem.count = 3;
        shoppingCartItem.update().then(()=>{
            TestShoppingCartItem.get(shoppingCartItem.id, TestShoppingCartItem).then((result)=>{
                expect(result.count).toBe(shoppingCartItem.count);
            });
        });
    });
});

test("simple updateMultiple", ()=>{
    TestShoppingCartItem.find(TestShoppingCartItem).then((shoppingCartItems)=>{
        shoppingCartItems.foreach((shoppingCartItem)=>{shoppingCartItem.count = 3;});

        TestShoppingCartItem.updateMultiple(shoppingCartItems).then(()=>{
            TestShoppingCartItem.find(TestShoppingCartItem).then((result)=>{
                result.foreach((item)=>{
                    expect(item.count).toBe(3);
                });
            });
        });
    });
});

test("simple destroy", ()=>{
    TestUser.destroy(testUsers.first()).then(()=>{
        TestUser.get(testUsers.first().id, TestUser).then((result)=>{
            expect(result).toBeNull();
        });
    });
});

test("simple destroyMultiple", ()=>{
    TestUser.destroyMultiple(testUsers).then(()=>{
        TestUser.find(TestUser).then((users)=>{
            expect(users.isEmpty).toBeTruthy();
        });
    });
});
*/