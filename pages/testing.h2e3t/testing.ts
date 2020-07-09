import {runAllTests} from "public/test/testRunner"

// @ts-ignore
$w.onReady(async function () {
    await runAllTests();
});
