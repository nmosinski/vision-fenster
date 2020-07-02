import KVMap from "./util/collections/map/KVMap";
import AbstractModel from "public/src/main/common/AbstractModel";

class Associations
{
    private _children: KVMap<string,{ new(): AbstractModel }>;
    private _parents: KVMap<string,{ new(): AbstractModel }>;

    constructor()
    {
        this.children = new KVMap<string,{ new(): AbstractModel }>();
    }

    hasParents(...parents: Array<{ new(): AbstractModel }>)
    {
        for(let idx in parents)
            this.hasChild(parents[idx]);
        return this;
    }

    hasParent(parent: { new(): AbstractModel })
    {
        this.children.add(parent.MODEL_NAME, parent);
        return this;
    }

    hasChildren(...children: Array<{new(): AbstractModel }>)
    {
        for(let idx in children)
            this.hasChild(children[idx]);
        return this;
    }

    hasChild(child: {new(): AbstractModel })
    {
        this.children.add(child.MODEL_NAME, child);
        return this;
    }

    set parents(parents: KVMap<string,{ new(): AbstractModel }>)
    {
        this._parents = parents;
    }

    get parents()
    {
        return this._parents;
    }

    set children(children: KVMap<string,{ new(): AbstractModel }>)
    {
        this._children = children;
    }

    get children()
    {
        return this._children;
    }
}

export default Associations