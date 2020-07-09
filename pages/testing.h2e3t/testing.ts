import {runAllTests} from "public/test/testRunner"
import wixData from "wix-data"
import WixDatabase from "../../public/main/common/orm/WixDatabase";
import TestShoppingCart from "../../public/test/public/main/common/orm/testData/TestShoppingCart";

// @ts-ignore
$w.onReady(async function () {
    console.log(await wixData.get("TestShoppingCart", "64147a44-7698-42cc-acb8-39b1200b52af"));
    console.log(await WixDatabase.get("64147a44-7698-42cc-acb8-39b1200b52af", TestShoppingCart));
    console.log(await TestShoppingCart.get("64147a44-7698-42cc-acb8-39b1200b52af", TestShoppingCart));
    await runAllTests();
});
