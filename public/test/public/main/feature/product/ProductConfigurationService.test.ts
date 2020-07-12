import { Tests, Test, truthly } from "../../../../../main/common/test/Test";

const PATH = "test/public/main/feature/product/ProductConfigurationService.test.js"


export async function runAllTests()
{
    let tests = new Tests(beforeAll, null, beforeEach, afterEach);
    
    //tests.add(new Test(PATH, "relational get", truthly(), relationalGet));

    
    await tests.runAll();
}

async function beforeAll()
{
    await afterEach();
}

async function beforeEach()
{
    
}

async function afterEach()
{
    
}