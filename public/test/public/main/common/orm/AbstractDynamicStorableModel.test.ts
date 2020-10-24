import MissingTableNameForDynamicAbstractStorableModelError from "../../../../../main/common/orm/MissingTableNameForDynamicAbstractStorableModelError";
import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import TestDynamicStorableModel from "./testData/TestDynamicStorableModel";

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
        const model = new TestDynamicStorableModel({ 'tableName': 'aTableName' });

        if (model.tableName !== 'aTableName')
        {
            console.log('first if');
            console.log('tableName:', model.tableName);
            return false;
        }
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
        new TestDynamicStorableModel();
        return false;
    }
    catch (err)
    {
        if (err instanceof MissingTableNameForDynamicAbstractStorableModelError)
            return true;
    }

    return false;
}