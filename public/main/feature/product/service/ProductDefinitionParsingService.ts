import ProductDefinition from "../model/ProductDefinition";
import List from "../../../common/util/collections/list/List";
import ProductOptionDefinition from "../model/ProductOptionDefinition";
import Combination from "../model/Combination";
import CombinationRequirement from "../model/CombinationRequirement";

class ProductDefinitionParsingService
{
    static parseFromJson(json: object): List<ProductDefinition>
    {
        return ProductDefinitionParsingService.parse(json);
    }

    private static parse(productDefObj: object): List<ProductDefinition>
    {
        let productDefinitions = new List<ProductDefinition>();
        for(var key1 in productDefObj)
        {   
            let productDef = productDefObj[key1];
            let productDefinition = new ProductDefinition(productDef.productModel);
            
            for(var key2 in productDef.productOptionDefinitions)
            {
                let productOptDef = productDef.productOptionDefinitions[key2];
                let productOptionDefinition = new ProductOptionDefinition(productOptDef.type, productOptDef.required);

                for(var key3 in productOptDef.combinations)
                {
                    let comb = productOptDef.combinations[key3];
                    let combination = new Combination();

                    for(var key4 in comb.tags)
                        combination.addTag(comb.tags[key4]);
                    
                    for(var key5 in comb.requirements)
                    {
                        let combReq = comb.requirements[key5];
                        let combinationRequirement = new CombinationRequirement(combReq.productOptionType);

                        for(var key6 in combReq.tags)
                            combinationRequirement.addTag(combReq.tags[key6]);
                        
                        combination.setRequirement(combinationRequirement);
                    }

                    productOptionDefinition.addCombination(combination);
                }

                productDefinition.setProductOptionDefinition(productOptionDefinition);
            }

            productDefinitions.add(productDefinition);
        }

        return productDefinitions;
    }
}

export default ProductDefinitionParsingService;