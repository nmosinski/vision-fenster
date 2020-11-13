import AbstractCheckedError from "../../../common/util/error/AbstractCheckedError";
import ProductConfiguration from "../model/ProductConfiguration";

class PriceCalculationImpossibleError extends AbstractCheckedError
{
    constructor (description: string = 'Price calculation is not possible for the given product', file: string, location: string)
    {
        super(description, file, location);
    }
}

export default PriceCalculationImpossibleError;