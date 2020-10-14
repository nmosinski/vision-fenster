import AbstractDynamicModel from "../../../../../../main/common/orm/AbstractDynamicModel";

class TestDynamicModel extends AbstractDynamicModel<TestDynamicModel>
{
    protected Constructor: new () => TestDynamicModel;
    protected modelName: string;

    init(data?: object): void
    // tslint:disable-next-line: no-empty
    {

    }

    addProperties(): void
    // tslint:disable-next-line: no-empty
    {

    }

    addRelations(): void
    // tslint:disable-next-line: no-empty
    {

    }
}

export default TestDynamicModel;