import AbstractModel from "../../../../common/orm/AbstractModel";
class DynamicBasePriceModel extends AbstractModel<DynamicBasePriceModel>
{
    protected Constructor: new () => DynamicBasePriceModel;
    protected modelName: string;

    init(): void
    {
        this.Constructor = DynamicBasePriceModel;
        this.modelName = 'DynamicBasePriceModel';
    }

    addProperties(): void
    {
        this.properties.
            number('width', 'positive').
            number('height', 'positive').
            number('price', 'positive');
    }

    addRelations(): void
    // tslint:disable-next-line: no-empty
    {

    }
}

export default DynamicBasePriceModel;

