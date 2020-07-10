import AbstractModel from "../../../common/orm/AbstractModel";

class ConfigurationOptionVariant extends AbstractModel<ConfigurationOptionVariant>
{
    protected Constructor: new () => ConfigurationOptionVariant;
    
    init(): void 
    {
        this.Constructor = ConfigurationOptionVariant;
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