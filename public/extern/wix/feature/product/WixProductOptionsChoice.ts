class WixProductOptionsChoice
{
    value: string;
    description: string;
    inStock: boolean;
    visible: boolean;
    constructor (value: string, description: string, inStock: boolean, visible: boolean)
    {
        this.value = value;
        this.description = description;
        this.inStock = inStock;
        this.visible = visible;
    }
}

export default WixProductOptionsChoice;