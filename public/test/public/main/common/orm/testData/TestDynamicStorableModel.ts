import AbstractDynamicStorableModel from "../../../../../../main/common/orm/AbstractDynamicStorableModel";

class TestDynamicStorableModel extends AbstractDynamicStorableModel<TestDynamicStorableModel>
{
    protected Constructor: new () => TestDynamicStorableModel;
    protected modelName: string;

    init(data?: Record<string, unknown>): void
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

export default TestDynamicStorableModel;