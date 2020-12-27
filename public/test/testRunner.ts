import { runAllTests as listTests } from "./public/main/common/collections/List.test"
import { runAllTests as abstractModelTests } from "./public/main/common/orm/AbstractModel.test"
import { runAllTests as aHoldsReferenceToBTests } from "./public/main/common/orm/AHoldsReferenceToB.test";
import { runAllTests as aHoldsNoReferenceToBTests } from "./public/main/common/orm/AHoldsNoReferenceToB.test";
import { runAllTests as abstractDynamicStorableModelTests } from "./public/main/common/orm/AbstractDynamicStorableModel.test";
import { runAllTests as manyToManyTests } from "./public/main/common/orm/ManyToMany.test";
import { runAllTests as productConfigurationServiceTests } from "./public/main/feature/product/ProductConfigurationService.test";
import { runAllTests as WixDatabaseTests } from "./public/main/extern/wix/common/persistance/WixDatabase.test";
import { runAllTests as WixProductOptionsInfoServiceTests } from "./public/main/extern/wix/feature/product/service/WixProductOptionsInfoService.test";
import { runAllTests as WixProductInfoTranslationServiceTests } from "./public/main/extern/wix/feature/product/service/WixProductInfoTranslationService.test";
import KVMap from "../main/common/util/collections/map/KVMap";
import List from "../main/common/util/collections/list/List";

const tests = new KVMap<string, () => Promise<void>>();

function init()
{
    tests.add("list", listTests);
    tests.add("wixDatabase", WixDatabaseTests);
    tests.add("abstractModel", abstractModelTests);
    tests.add("aHoldsReferenceToB", aHoldsReferenceToBTests);
    tests.add("aHoldsNoReferenceToB", aHoldsNoReferenceToBTests);
    tests.add("manyToMany", manyToManyTests);
    tests.add("productConfigurationService", productConfigurationServiceTests);
    tests.add("abstractDynamicModel", abstractDynamicStorableModelTests);
    tests.add("wixProductOptionsInfoService", WixProductOptionsInfoServiceTests);
    tests.add("wixProductInfoTranslationService", WixProductInfoTranslationServiceTests);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function run(toRun: List<() => Promise<void>>): Promise<void>
{
    await toRun.foreachAsync(async (testFunction) => await testFunction());
}

export async function runAllTests(): Promise<void>
{
    init();
    await tests.values().foreachAsync(async (testFunction) => await testFunction());
}

export async function runTests(...testNames: string[]): Promise<void>
{
    init();
    const toRun = new List<string>(testNames);

    await toRun.foreachAsync(async name => await (tests.get(name)()));
}

export async function runAllTestsExcept(...testNames: string[]): Promise<void>
{
    init();
    const notToRun = new List<string>(testNames);

    await tests.filter((name) => !notToRun.has(name)).foreachAsync(async name => await (tests.get(name)()));
}