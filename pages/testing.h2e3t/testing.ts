import { runAllTests, runTests } from "public/test/testRunner"
import List from "../../public/main/common/util/collections/list/List";

// @ts-ignore
$w.onReady(async function () {
    await runTests("abstractModel");

});
