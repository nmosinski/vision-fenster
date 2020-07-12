import {runAllTests as abstractModelTests} from "./public/main/common/orm/AbstractModel.test"
import {runAllTests as aHoldsReferenceToBTests} from "./public/main/common/orm/AHoldsReferenceToB.test";
import {runAllTests as aHoldsNoReferenceToBTests} from "./public/main/common/orm/AHoldsNoReferenceToB.test";
import {runAllTests as manyToManyTests} from "./public/main/common/orm/ManyToMany.test";
import {runAllTests as productConfigurationServiceTests} from "./public/main/feature/product/ProductConfigurationService.test";

export async function runAllTests()
{
    await abstractModelTests();
    await aHoldsReferenceToBTests();
    await aHoldsNoReferenceToBTests();
    await manyToManyTests();
    await productConfigurationServiceTests();
}