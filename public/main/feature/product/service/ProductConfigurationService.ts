import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";


class Product
{
    options: KVMap<string, ProductOption>;

    getOptionByName(name: string)
    {
        return this.options.get(name);
    }
}


class ProductConfigurationService
{
    product: Product;
    productDefinition: ProductDefinition;

    productSatisfiesOption(option: ProductOption)
    {
        let optionDefinition: ProductOptionDefinition;
        let relevantCombinations: List<Combination>;

        // find the definition that belongs to this option (by type/name)
        this.productDefinition.productOptionDefinitions.foreach((definition)=>{
            if(optionDefinition.name === option.type)
                optionDefinition = definition;
        });

        if(!optionDefinition)
            throw Error("Unknown option");

        // filter for the combinations that match the tags of the given option. Only those are relevant
        relevantCombinations = optionDefinition.combinations.filter((combination)=>{
            return combination.tags.isSublistOf(option.tags);
        });

        let foundValidCombination = false;
        // iterate through the relevant combinations
        relevantCombinations.foreach((combination)=>{
            // If a combination has no requirements, it's a save match
            // Else, check if all requirements of the given combination are fulfilled by the product
            if(combination.requirements.isEmpty())
                foundValidCombination = true;
            else
            {
                let requirementsFulfilled = false;
                // Iterate through all requirements for this combination
                combination.requirements.foreach((requirement)=>{
                    // Pich the option from the product this requirements refers to
                    let option = this.product.getOptionByName(requirement.productOptionType);
                    // Give the product the chance to fulfill the requirement only if he has the option this requirement refers to
                    if(option)
                        if(requirement.tags.isSublistOf(option.tags))
                            requirementsFulfilled = true;
                });
                // If requirements fulfilled, found a valid combination
                if(requirementsFulfilled)
                    foundValidCombination = true;
            }
        });

        return foundValidCombination;
    }
}

class ProductDefinition
{
    private _productOptionDefinitions: KVMap<string, ProductOptionDefinition>;
    private _model: string;

    constructor(model: string, productOptionDefinitions: List<ProductOptionDefinition>=new List<ProductOptionDefinition>())
    {
        this.model = model;
        this.productOptionDefinitions = productOptionDefinitions;
    }

    addProductOptionDefinition(productOptionDefinition: ProductOptionDefinition)
    {
        this._productOptionDefinitions.add(productOptionDefinition.type, productOptionDefinition);
    }

    getProductOptionDefinition(type: string)
    {
        return this._productOptionDefinitions.get(type);
    }

    removeProductOptionDefinition(type: string)
    {
        this._productOptionDefinitions.remove(type);
    }

    set model(model: string)
    {
        this._model = model;
    }

    set productOptionDefinitions(productOptionDefinitions: List<ProductOptionDefinition>)
    {
        this._productOptionDefinitions = new KVMap<string, ProductOptionDefinition>();
        productOptionDefinitions.foreach((definition)=>{this.addProductOptionDefinition(definition)});
    }

    get model(): string
    {
        return this._model;
    }

    get productOptionDefinitions(): List<ProductOptionDefinition>
    {
        return this._productOptionDefinitions.values();
    }
}

class ProductOption
{
    tags: List<string>;
    image: string;
    value: string;
    type: string;

    constructor(type: string, value: string, tags: List<string>, image?: string)
    {

    }
}

class ProductOptionDefinition
{
    private _type: string;
    private _combinations: List<Combination>;
    constructor(type: string, combinations: List<Combination>=new List<Combination>())
    {
        this.type = type;
        this.combinations = combinations;
    }

    addCombination(combination: Combination)
    {
        this._combinations.add(combination);
    }

    removeCombination(combination: Combination)
    {
        this.combinations.remove(this.combinations.indexOf(combination));
    }

    set combinations(combinations: List<Combination>)
    {
        this._combinations = combinations;
    }

    set type(type: string)
    {
        this._type = type;
    }

    get type(): string
    {
        return this._type;
    }
}

class Combination
{
    private _tags: List<string>;
    private _requirements: KVMap<string, CombinationRequirement>;

    constructor(tags: List<string>=new List<string>(), requirements: List<CombinationRequirement>=new List<CombinationRequirement>())
    {
        this.tags = tags;
        this.requirements = requirements;
    }

    addTag(tag: string)
    {
        this.tags.add(tag);
    }

    removeTag(tag: string)
    {
        this.tags.remove(this.tags.indexOf(tag));
    }

    addRequirement(requirement: CombinationRequirement)
    {
        this._requirements.add(requirement.productOptionType, requirement);
    }

    getRequirement(productOptionType: string)
    {
        return this._requirements.get(productOptionType);
    }

    removeRequirement(productOptionType: string)
    {
        this._requirements.remove(productOptionType);
    }

    set tags(tags: List<string>)
    {
        this._tags = tags;
    }
    
    set requirements(requirements: List<CombinationRequirement>)
    {
        this._requirements = new KVMap<string, CombinationRequirement>();
        requirements.foreach((requirement)=>{this.addRequirement(requirement);});
    }

    get tags()
    {
        return this._tags;
    }

    get requirements(): List<CombinationRequirement>
    {
        return this._requirements.values();
    }
}

class CombinationRequirement
{
    private _productOptionType: string;
    private _tags: List<string>;

    constructor(productOptionType: string, tags: List<string>=new List<string>())
    {
        this.productOptionType = productOptionType;
        this.tags = tags;
    }

    addTag(tag: string)
    {
        this.tags.add(tag);
    }

    removeTag(tag: string)
    {
        this.tags.remove(this.tags.indexOf(tag));
    }

    set productOptionType(productOptionType: string)
    {
        this._productOptionType = productOptionType;
    }

    set tags(tags: List<string>)
    {
        this._tags = tags;
    }

    get productOptionType()
    {
        return this._productOptionType;
    }

    get tags()
    {
        return this._tags;
    }
}

function parseDefinitions(object: Object): List<ProductDefinition>
{
    let productDefinitions = new List<ProductDefinition>();
    for(var key in productDefinitions)
    {   
        let productDef = productDefinitions[key];
        let productDefinition = new ProductDefinition(productDef.model);
        
        for(var key in productDef.options)
        {
            let productOptDef = productDef.options[key];
            let productOptionDefinition = new ProductOptionDefinition(productOptDef.type);

            for(var key in productOptDef.combinations)
            {
                let comb = productOptDef.combinations[key];
                let combination = new Combination();

                for(var tag in comb.tags)
                    combination.addTag(tag);
                
                for(var key in comb.requirements)
                {
                    let combReq = comb.requirements[key];
                    let combinationRequirement = new CombinationRequirement(combReq.type);

                    for(var tag in combReq.tags)
                        combinationRequirement.addTag(tag);
                    
                    combination.addRequirement(combinationRequirement);
                }

                productOptionDefinition.addCombination(combination);
            }

            productDefinition.addProductOptionDefinition(productOptionDefinition);
        }

        productDefinitions.add(productDefinition);
    }

    return productDefinitions;
}

const productDefinitionObject =
{
    0: 
    {
        "model": "fenster",
        "productOptionDefinitions": 
        {
            0: 
            {
                "type": "material",
                "combinations": 
                {
                    0: 
                    {
                        "tags": ["kunststoff"],
                        "requirements": {}
                    },
                    1: 
                    {
                        "tags": ["holz"],
                        "requirements": {}
                    }, 
                }
            },
            1: 
            {
                "type": "profil",
                "combinations": 
                {
                    0: 
                    {
                        "tags": ["kunststoff", "kömmerling"],
                        "requirements": 
                        {
                            0:
                            {
                                "productOptionType":"material",
                                "tags": ["kunststoff"]
                            }
                        }
                    },

                    1:
                    {
                        "tags": ["kunststoff", "arcade"],
                        "requirements": 
                        {
                            0:
                            {
                                "productOptionType": "material",
                                "tags": ["kunststoff"]
                            }
                        }
                    }
                }
            },
            2:
            {
                "type": "farbe",
                "combinations":
                {
                    0:
                    {
                        "tags": ["kunststoff, kömmerling"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "profil",
                                "tags": ["kunststoff, kömmerling"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["kunststoff, arcade"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "profil",
                                "tags": ["kunststoff, arcade"]
                            }
                        }
                    }
                }
            },
            3:
            {
                "type": "fenstertyp",
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig"],
                        "requirements": {}
                    },
                    1:
                    {
                        "tags": ["zweiteilig"],
                        "requirements": {}
                    },
                    2:
                    {
                        "tags": ["dreiteilig"],
                        "requirements": {}
                    }
                }
            },
            4:
            {
                "type": "fensterlicht",
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["einteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    2:
                    {
                        "tags": ["einteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            }
                        }
                    },
                    3:
                    {
                        "tags": ["zweiteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    4:
                    {
                        "tags": ["zweiteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    5:
                    {
                        "tags": ["zweiteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["zweiteilig"]
                            }
                        }
                    },
                    6:
                    {
                        "tags": ["dreiteilig", "ohnelicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    },
                    7:
                    {
                        "tags": ["dreiteilig", "unterlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    },
                    8:
                    {
                        "tags": ["dreiteilig", "oberlicht"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["dreiteilig"]
                            }
                        }
                    }
                }
            },
            5:
            {
                "type": "öffnungsart",
                "combinations":
                {
                    0:
                    {
                        "tags": ["einteilig", "ohnelicht", "fest"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    1:
                    {
                        "tags": ["einteilig", "ohnelicht", "dreh"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    2:
                    {
                        "tags": ["einteilig", "ohnelicht", "kipp"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    },
                    3:
                    {
                        "tags": ["einteilig", "ohnelicht", "kipp", "dreh"],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": "fenstertyp",
                                "tags": ["einteilig"]
                            },
                            1:
                            {
                                "productOptionType": "fensterlicht",
                                "tags": ["ohnelicht"]
                            }
                        }
                    }
                }
            }
        }
    }
}