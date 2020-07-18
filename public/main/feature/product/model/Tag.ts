import AbstractModel from "../../../common/orm/AbstractModel";
import ProductOption from "./ProductOption";

class Tag extends AbstractModel<Tag>
{
    protected Constructor: new () => Tag;
    
    init(): void 
    {
        this.Constructor = Tag;
    }

    addProperties(): void 
    {
        this.properties.
        string("title");
    }

    addRelations(): void 
    {
        this.manyToMany(ProductOption);
    }
}

export default Tag;