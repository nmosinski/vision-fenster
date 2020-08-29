import { runAllTests as listTests } from "./public/main/common/collections/List.test"
import { runAllTests as abstractModelTests } from "./public/main/common/orm/AbstractModel.test"
import { runAllTests as aHoldsReferenceToBTests } from "./public/main/common/orm/AHoldsReferenceToB.test";
import { runAllTests as aHoldsNoReferenceToBTests } from "./public/main/common/orm/AHoldsNoReferenceToB.test";
import { runAllTests as manyToManyTests } from "./public/main/common/orm/ManyToMany.test";
import { runAllTests as productConfigurationServiceTests } from "./public/main/feature/product/ProductConfigurationService.test";
import KVMap from "../main/common/util/collections/map/KVMap";
import List from "../main/common/util/collections/list/List";

var tests = new KVMap<string, Function>();

function init() {
    tests.add("list", listTests);
    tests.add("abstractModel", abstractModelTests);
    tests.add("aHoldsReferenceToB", aHoldsReferenceToBTests);
    tests.add("aHoldsNoReferenceToB", aHoldsNoReferenceToBTests);
    tests.add("manyToMany", manyToManyTests);
    tests.add("productConfigurationService", productConfigurationServiceTests);
}

export async function runAllTests() {
    init();
    await tests.values().foreachAsync(async (testFunction) => await testFunction());
}

export async function runTests(...testNames: Array<string>) {
    init();
    let toRun = new List<string>(testNames);

    await toRun.foreachAsync(async name => await tests.get(name)());
}