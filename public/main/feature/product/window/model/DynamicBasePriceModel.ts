import AbstractDynamicStorableModel from "../../../../common/orm/AbstractDynamicStorableModel";
import FensterBasePriceT from "./FensterBasePriceT";

class DynamicBasePriceModel extends AbstractDynamicStorableModel<DynamicBasePriceModel>
{
    protected Constructor: new () => DynamicBasePriceModel;
    protected modelName: string;
    private _width: number;
    private _height: number;
    private _price: number;

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

    get price(): number
    {
        return this._price;
    }

    set price(value: number)
    {
        this._price = value;
    }
}

export default DynamicBasePriceModel;

