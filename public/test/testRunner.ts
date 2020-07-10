import {runAllTests as abstractModelTest} from "./public/main/common/orm/AbstractModel.test"
import {runAllTests as aHoldsReferenceToB} from "./public/main/common/orm/AHoldsReferenceToB.test";
import {runAllTests as aHoldsNoReferenceToB} from "./public/main/common/orm/AHoldsNoReferenceToB.test";

export async function runAllTests()
{
    await abstractModelTest();
    await aHoldsReferenceToB();
    await aHoldsNoReferenceToB();
}