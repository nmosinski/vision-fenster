import { runAllTests, runTests, runAllTestsExcept } from "public/test/testRunner"
import List from "../../public/main/common/util/collections/list/List";

// @ts-ignore
$w.onReady(async () =>
{
    await runAllTests();
    // await runAllTestsExcept('productConfigurationService');
    // await runTests('abstractModel');
    // await runTests("manyToMany");
    // await runTests("list", "abstractModel");
});

