import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase from "../../../../../public/main/common/orm/WixDatabase";
import AbstractModel from "../../../../../public/main/common/orm/AbstractModel";


let testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
let testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCart, 5);
let testUsers = TestUser.dummies(TestUser, 2);

beforeEach(()=>{
    WixDatabase.storeMultiple(testUsers);
    WixDatabase.storeMultiple(testShoppingCartItems);
    WixDatabase.storeMultiple(testUsers);
});

afterEach(()=>{
    WixDatabase.removeAll(TestUser);
    WixDatabase.removeAll(TestShoppingCart);
    WixDatabase.removeAll(TestShoppingCartItem);
});

test("simple get", ()=>{
    AbstractModel.get(testShoppingCarts.first().pk, TestShoppingCart).then((result)=>{
        expect(result.pk).toBe(testShoppingCarts.first().pk);
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
        TestShoppingCart.get(shoppingCart.pk, TestShoppingCart).then((result)=>{
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
    TestShoppingCartItem.get(testShoppingCartItems.first().pk, TestShoppingCartItem).then((shoppingCartItem)=>{
        shoppingCartItem.count = 3;
        shoppingCartItem.update().then(()=>{
            TestShoppingCartItem.get(shoppingCartItem.pk, TestShoppingCartItem).then((result)=>{
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
        TestUser.get(testUsers.first().pk, TestUser).then((result)=>{
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
