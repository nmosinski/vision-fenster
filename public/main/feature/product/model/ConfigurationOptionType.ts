import AbstractModel from "../../../common/orm/AbstractModel";

class ConfigurationOptionType extends AbstractModel<ConfigurationOptionType>
{
    protected Constructor: new () => ConfigurationOptionType;
    
    init(): void 
    {
        this.Constructor = ConfigurationOptionType;
    }
    
    addProperties(): void
    {
        throw new Error("Method not implemented.");
    }

    addRelations(): void 
    {
        throw new Error("Method not implemented.");
    }
    
}