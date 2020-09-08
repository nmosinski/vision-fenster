import { runAllTests, runTests, runAllTestsExcept } from "public/test/testRunner"
import List from "../../public/main/common/util/collections/list/List";

// @ts-ignore
$w.onReady(async function () {
    // await runAllTests();
    await runAllTestsExcept('productConfigurationService');
    // await runTests("manyToMany");
    // await runTests("abstractModel");
});
