import WixProductOptionsChoice from "./WixProductOptionsChoice";

class WixProductOptionInfo
{
    name: string;
    choices: Array<WixProductOptionsChoice>;
    constructor (name: string, choices: Array<WixProductOptionsChoice>)
    {
        this.name = name;
        this.choices = choices;
    }
}

export default WixProductOptionInfo;