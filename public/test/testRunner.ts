import {runAllTests as abstractModelTest} from "./public/main/common/orm/AbstractModel.test"

export async function runAllTests()
{
    await abstractModelTest();
}