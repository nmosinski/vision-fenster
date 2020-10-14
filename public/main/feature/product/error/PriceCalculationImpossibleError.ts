import AbstractCheckedError from "../../../common/util/error/AbstractCheckedError";
import Product from "../model/Product";

class PriceCalculationImpossibleError extends AbstractCheckedError
{
    constructor (description: string = 'Price calculation is not possible for the given product', file: string, location: string)
    {
        super(description, file, location);
    }
}

export default PriceCalculationImpossibleError;