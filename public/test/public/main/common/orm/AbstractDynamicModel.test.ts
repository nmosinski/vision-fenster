import MissingTableNameForDynamicAbstractModelError from "../../../../../main/common/orm/MissingTableNameForDynamicAbstractModelError";
import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import TestDynamicModel from "./testData/TestDynamicModel";

const PATH = 'test/public/main/common/orm/AbstractDynamicModel.test';

export async function runAllTests()
{
    const tests = new Tests(undefined, undefined, undefined, undefined);

    tests.add(new Test(PATH, "child class is being initialized properly", truthly(), childClassIsBeingInitializedProperly));
    tests.add(new Test(PATH, "error is being thrown if table name is missing", truthly(), errorIsBeingThrownIfTableNameIsMissing));

    await tests.runAll();
}

async function childClassIsBeingInitializedProperly()
{
    try
    {
        // tslint:disable-next-line: no-unused-expression
        new TestDynamicModel({ 'tableName': 'aTableName' });
        return true;
    }
    catch (err)
    {
        return false;
    }

    return false;
}

async function errorIsBeingThrownIfTableNameIsMissing()
{
    try
    {
        // tslint:disable-next-line: no-unused-expression
        new TestDynamicModel();
        return false;
    }
    catch (err)
    {
        if (err instanceof MissingTableNameForDynamicAbstractModelError)
            return true;
    }

    return false;
}