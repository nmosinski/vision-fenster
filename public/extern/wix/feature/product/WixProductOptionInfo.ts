import IComparable from "../../../../main/common/util/IComparable";
import WixProductOptionsChoice from "./WixProductOptionsChoice";

class WixProductOptionInfo implements IComparable
{
    name: string;
    choices: Array<WixProductOptionsChoice>;
    constructor (name: string, choices: Array<WixProductOptionsChoice>)
    {
        this.name = name;
        this.choices = choices;
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    equals(object: object): boolean
    {
        if (!(object instanceof WixProductOptionInfo))
            return false;

        if (this.name !== object.name)
            return false;

        if (!Array.isArray(object.choices) || this.choices.length !== object.choices.length)
            return false;

        for (let i = 0; i < this.choices.length; i++)
            if (!this.choices[i].equals(object.choices[i]))
                return false;

        return true;
    }


}

export default WixProductOptionInfo;