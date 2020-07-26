import AbstractModel from "../orm/AbstractModel";
import ProductOption from "../../feature/product/model/ProductOption";

class Tag extends AbstractModel<Tag>
{
    protected Constructor: new () => Tag;

    init(): void {
        this.Constructor = Tag;
    }

    addProperties(): void {
        this.properties.
            string("title");
    }

    addRelations(): void {
        this.manyToMany(ProductOption);
    }
}

export default Tag;