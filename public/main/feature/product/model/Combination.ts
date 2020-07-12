import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";
import CombinationRequirement from "./CombinationRequirement";

class Combination
{
    private _tags: List<string>;
    private _requirements: KVMap<string, CombinationRequirement>;

    constructor(tags?: List<string>, requirements?: List<CombinationRequirement>)
    {
        this.tags = tags;
        this.requirements = requirements;
    }

    addTag(tag: string): void
    {
        this.tags.add(tag);
    }

    removeTag(tag: string): void
    {
        this.tags.remove(this.tags.indexOf(tag));
    }

    setRequirement(requirement: CombinationRequirement): void
    {
        this._requirements.add(requirement.productOptionType, requirement);
    }

    getRequirement(productOptionType: string): CombinationRequirement
    {
        return this._requirements.get(productOptionType);
    }

    removeRequirement(productOptionType: string): void
    {
        this._requirements.remove(productOptionType);
    }

    set tags(tags: List<string>)
    {
        if(tags)
            this._tags = tags;
        else
            this._tags = new List<string>();
    }
    
    set requirements(requirements: List<CombinationRequirement>)
    {
        this._requirements = new KVMap<string, CombinationRequirement>();
        if(requirements)
            requirements.foreach((requirement)=>{this.setRequirement(requirement);});
    }

    get tags(): List<string>
    {
        return this._tags;
    }

    get requirements(): List<CombinationRequirement>
    {
        return this._requirements.values();
    }
}

export default Combination;