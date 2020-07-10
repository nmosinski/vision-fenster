import TestShoppingCart from "./testData/TestShoppingCart";
import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import TestUser from "./testData/TestUser";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value} from "../../../../../main/common/test/Test";
import AbstractModel from "../../../../../main/common/orm/AbstractModel";
import List from "../../../../../main/common/util/collections/list/List";
const PATH = "test/public/main/common/orm/AbstractModel.test.js"

var testShoppingCarts: List<TestShoppingCart>;
var testShoppingCartItems: List<TestShoppingCartItem>;
var testUsers: List<TestUser>;

function initTestData()
{
    testShoppingCarts = TestShoppingCart.dummies(TestShoppingCart, 3);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    testUsers = TestUser.dummies(TestUser, 2);
}

export async function runAllTests()
{
    initTestData();
 
    let tests = new Tests(afterEach, null, beforeEach, afterEach);
    
    tests.add(new Test(PATH, "relational assign", value(testShoppingCarts.first().id), relationalAssign));
    tests.add(new Test(PATH, "relational assignMultiple", truthly(), relationalAssignMultiple));
    tests.add(new Test(PATH, "relational get", value(testShoppingCarts.first().id), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));

    await tests.runAll();
}


async function beforeEach()
{
    await WixDatabase.createMultiple(testShoppingCarts);
    await WixDatabase.createMultiple(testShoppingCartItems);
    await WixDatabase.createMultiple(testUsers);
}

async function afterEach()
{
    await WixDatabase.removeAll(TestUser);
    await WixDatabase.removeAll(TestShoppingCart);
    await WixDatabase.removeAll(TestShoppingCartItem);
}

async function simpleGet()
{
    let result = await AbstractModel.get(testShoppingCarts.first().id, TestShoppingCart);
    if(result)
        return result.id;
    else
        return result;
}

async function simpleFind()
{
    let result = await AbstractModel.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleCreate()
{
    let shoppingCart = TestShoppingCart.dummy(TestShoppingCart);
    await shoppingCart.create();
    let result = await TestShoppingCart.get(shoppingCart.id, TestShoppingCart);
    return result;
}

async function simpleCreateMultiple()
{
    await WixDatabase.removeAll(TestShoppingCartItem);  
    await TestShoppingCartItem.createMultiple(testShoppingCartItems);
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleUpdate()
{
    let item = await TestShoppingCartItem.get(testShoppingCartItems.first().id, TestShoppingCartItem);
    item.count = 3;
    await item.update();
    let updatedItem = await TestShoppingCartItem.get(item.id, TestShoppingCartItem);   
    return updatedItem.count;
}

async function simpleUpdateMultiple()
{
    let items = await TestShoppingCartItem.find(TestShoppingCartItem);
    items.foreach((item)=>{item.count = 3;});
    await TestShoppingCartItem.updateMultiple(items);
    let updatedItems = await TestShoppingCartItem.find(TestShoppingCartItem);
    updatedItems.foreach((item)=>{
        if(item.count !== 3)
            return false;
    });
    return true;
}

async function simpleSave()
{
    await WixDatabase.removeAll(TestShoppingCartItem);  
    await TestShoppingCartItem.saveMultiple(testShoppingCartItems);
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleSaveMultiple()
{
    await WixDatabase.removeAll(TestShoppingCartItem);  
    await TestShoppingCartItem.saveMultiple(testShoppingCartItems);
    let result = await TestShoppingCartItem.find(TestShoppingCartItem);
    return result.equals(testShoppingCartItems);
}

async function simpleDestroy()
{
    await TestUser.destroy(testUsers.first());
    let result = await TestUser.get(testUsers.first().id, TestUser);
    return result;
}

async function simpleDestroyMultiple()
{
    await TestUser.destroyMultiple(testUsers);
    let result = await TestUser.find(TestUser);
    return result.isEmpty();
}