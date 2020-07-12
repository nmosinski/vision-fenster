import List from "../../../common/util/collections/list/List";
import Combination from "./Combination";

class ProductOptionDefinition
{
    private _type: string;
    private _required: boolean;
    private _combinations: List<Combination>;
    
    constructor(type: string, required: boolean, combinations?: List<Combination>)
    {
        this.type = type;
        this.required = required;
        this.combinations = combinations;
    }

    addCombination(combination: Combination): void
    {
        this._combinations.add(combination);
    }

    removeCombination(combination: Combination): void
    {
        this.combinations.remove(this.combinations.indexOf(combination));
    }

    set type(type: string)
    {
        this._type = type;
    }

    set required(required: boolean)
    {
        this._required = required;
    }

    set combinations(combinations: List<Combination>)
    {
        if(combinations)
            this._combinations = combinations;
        else
            this._combinations = new List<Combination>();
    }

    get type(): string
    {
        return this._type;
    }

    get required(): boolean
    {
        return this._required;
    }

    get combinations(): List<Combination>
    {
        return this._combinations;
    }
}

export default ProductOptionDefinition;