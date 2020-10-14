import AbstractModel from "../../../../common/orm/AbstractModel";
class DynamicBasePriceModel extends AbstractModel<DynamicBasePriceModel>
{
    protected Constructor: new () => DynamicBasePriceModel;
    protected modelName: string;
    private _width: number;
    private _height: number;

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

    get width(): number
    {
        return this._width;
    }

    set width(value: number)
    {
        this._width = value;
    }

    get height(): number
    {
        return this._height;
    }

    set height(value: number)
    {
        this._height = value;
    }
}

export default DynamicBasePriceModel;

