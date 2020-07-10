import AbstractModel from "../../../common/orm/AbstractModel";

class ConfigurationModel extends AbstractModel<ConfigurationModel>
{
    protected Constructor: new () => ConfigurationModel;
    
    init(): void 
    {
        this.Constructor = ConfigurationModel;
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