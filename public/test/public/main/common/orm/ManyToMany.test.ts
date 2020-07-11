import TestShoppingCartItem from "./testData/TestShoppingCartItem";
import WixDatabase from "../../../../../main/common/orm/WixDatabase";
import { Tests, Test, truthly, unspecified, value} from "../../../../../main/common/test/Test";
import List from "../../../../../main/common/util/collections/list/List";
import TestTag from "./testData/TestTag";
import wixData from "wix-data"
import ManyToMany from "../../../../../main/common/orm/ManyToMany";
const PATH = "test/public/main/common/orm/ManyToMany.test.js"

var testShoppingCartItems: List<TestShoppingCartItem>;
var testTags: List<TestTag>;

export async function runAllTests()
{
    let tests = new Tests(beforeAll, null, beforeEach, afterEach);
    
    //tests.add(new Test(PATH, "relational assign", truthly(), relationalAssign));
    //tests.add(new Test(PATH, "relational assign multiple", truthly(), relationalAssignMultiple));
    tests.add(new Test(PATH, "relational get", truthly(), relationalGet));
    tests.add(new Test(PATH, "relational find", truthly(), relationalFind));
    tests.add(new Test(PATH, "relational destroy", truthly(), relationalDestroy));
    tests.add(new Test(PATH, "relational destroy multiple", truthly(), relationalDestroyMultiple));
    
    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}

async function beforeEach()
{
    testTags = TestTag.dummies(TestTag, 5);
    testShoppingCartItems = TestShoppingCartItem.dummies(TestShoppingCartItem, 5);
    await WixDatabase.createMultiple(testTags);
    await WixDatabase.createMultiple(testShoppingCartItems);

    // the first shopping cart item has all tags / each tag has the first shopping cart
    let roleItems = [];
    testTags.foreach((tag: TestTag)=>{
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
    await WixDatabase.removeAll(TestTag);
    await WixDatabase.removeAll(TestShoppingCartItem);
    await wixData.truncate("RoleTestShoppingCartItemTestTag");
}

async function relationalGet()
{
    let item = await testShoppingCartItems.first().testTags().get();

    return testTags.first().id === item.id;
}

async function relationalFind()
{
    let result = await testShoppingCartItems.first().testTags().find();
    return result.equals(testTags);
}
function partB(){}
async function relationalDestroy()
{
    let resultBeforeDestroy = await testTags.last().testShoppingCartItems().find();
    //////console.log(resultBeforeDestroy);
    if(!(resultBeforeDestroy.has(testShoppingCartItems.first()) && resultBeforeDestroy.has(testShoppingCartItems.last()) && resultBeforeDestroy.length === 2))
        return false;

    //console.log("shoppingCartItems");
    //console.log(testShoppingCartItems);
    //console.log("tags");
    //console.log(testTags);
    //console.log("\n");

    //console.log("RoleTable before destroy");
    //console.log("1");
    let roleTestTableBeforeDestr = await wixData.query("RoleTestShoppingCartItemTestTag").find();
    //console.log(roleTestTableBeforeDestr);
    //console.log("\n");

    //console.log("destroy...");
    //console.log("2");
    await testTags.last().destroy();
    //console.log("\n");

    //console.log("RoleTable after destroy");
    //console.log("3");
    let roleTestTableAfterDestr = await wixData.query("RoleTestShoppingCartItemTestTag").find();
    ////console.log(roleTestTableAfterDestr);
    //console.log("\n");


    //console.log("ShoppingCarts of the last tag after destroying it");
    //console.log("4");
    let resultAfterDestroy = await testTags.last().testShoppingCartItems().find();
    //console.log(resultAfterDestroy);
    //////console.log(testShoppingCartItems);
    //////console.log(testTags);
    if(!resultAfterDestroy.isEmpty())
        return false;
    
    return true;
}

async function relationalDestroyMultiple()
{
    let resultOfLastBeforeDestroy = await testTags.last().testShoppingCartItems().find();
    if(!(resultOfLastBeforeDestroy.has(testShoppingCartItems.first()) && resultOfLastBeforeDestroy.has(testShoppingCartItems.last()) && resultOfLastBeforeDestroy.length === 2))
        return false;

    let resultOfFirstBeforeDestroy = await testTags.first().testShoppingCartItems().find();
    if(resultOfFirstBeforeDestroy.first().id !== testShoppingCartItems.first().id)
        return false;

    await TestShoppingCartItem.destroyMultiple(testShoppingCartItems);
    let resultOfLastAfterDestroy = await testTags.last().testShoppingCartItems().find();
    if(!resultOfLastAfterDestroy.isEmpty())
        return false;

    let resultOfFirstAfterDestroy = await testTags.first().testShoppingCartItems().find();
    if(!resultOfFirstAfterDestroy.isEmpty())
        return false;
    
    return true;
}