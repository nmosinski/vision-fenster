import AbstractDynamicModel from "../../../../common/orm/AbstractDynamicModel";
import FensterBasePriceT from "./FensterBasePriceT";

class DynamicBasePriceModel extends AbstractDynamicModel<DynamicBasePriceModel>
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
    {
        this.manyToOne(FensterBasePriceT);
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

