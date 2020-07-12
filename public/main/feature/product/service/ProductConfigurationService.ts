import List from "../../../common/util/collections/list/List";
import KVMap from "../../../common/util/collections/map/KVMap";

class Product
{
    private _options: KVMap<string, ProductOption>;

    constructor(options?: List<ProductOption>)
    {
        this.options = options;
    }

    setOption(option: ProductOption): void
    {
        this._options.add(option.type.title, option);
    }

    hasOption(typeTitle: string): boolean
    {
        if(this.getOption(typeTitle))
            return true;
        return false;
    }

    getOption(typeTitle: string)
    {
        return this._options.get(typeTitle);
    }

    removeOption(typeTitle: string): void
    {
        this._options.remove(typeTitle);
    }

    set options(options: List<ProductOption>)
    {
        this._options = new KVMap<string, ProductOption>();
        if(options)
            options.foreach((option) => {this.setOption(option);});
    }

    get options(): List<ProductOption>
    {
        return this._options.values();
    }
}

class ProductOptionType
{
    private _title: string;

    constructor(title: string)
    {

    }

    set title(title: string)
    {
        this._title = title;
    }

    get title(): string
    {
        return this._title;
    }

    
}

class ProductOption
{
    
    private _type: ProductOptionType;
    private _value: string;
    private _tags: List<string>;
    private _image: string;

    constructor(value: string, tags?: List<string>, image?: string)
    {
        this.value = value;
        this.tags = tags;
        this.image = image;
    }

    hasTag(tag: string): boolean
    {
        return this.tags.has(tag);
    }

    set type(type: ProductOptionType)
    {
        this._type = type;
    }

    set value(value: string)
    {
        this._value = value;
    }

    set tags(tags: List<string>)
    {
        if(tags)
            this._tags = tags;
        else
            this._tags = new List<string>();
    }

    set image(image: string)
    {
        if(image)
            this._image = image;
        else
            this._image = "";
    }

    get type(): ProductOptionType
    {
        return this._type;
    }

    get value(): string
    {
        return this._value;
    }

    get tags(): List<string>
    {
        return this._tags;
    }

    get image(): string
    {
        return this._image;
    }
}




class ProductConfigurationService
{
    private _productDefinition: ProductDefinition;

    constructor(productDefinition: ProductDefinition)
    {
        this.productDefinition = productDefinition;
    }

    /**
     * Set a product option.
     * @param productOption The product option to be set.
     * @returns {boolean} True if the option has been set or false, if the option couldn't be set due to complications with higher ranked options.
     */
    setProductOption(productOption: ProductOption, product: Product): boolean
    {
        if(this.productSatisfiesOption(productOption, product))
            product.setOption(productOption);
        else
            return false;
        return true;
    }

    /**
     * Filter the passed options for those that are valid. If a type parameter is passed, filter only for those options of the given type.
     * @param {string} [type=null] The type to be filtered for.
     * @returns {List<ProductOption>} A list containing all valid options considering the request.
     */
    filterValidOptions(allProductOptions: List<ProductOption>, product: Product, productOptionTypeTitle: string=null): List<ProductOption>
    {
        let relevantProductOptions = allProductOptions;
        let filteredProductOptions = new List<ProductOption>();

        if(productOptionTypeTitle)
            relevantProductOptions = allProductOptions.filter((option)=>{return option.type.title === productOptionTypeTitle;});
        
        for(let idx = 0; idx < relevantProductOptions.length; idx++)
        {
            let opt = relevantProductOptions.get(idx);

            if(this.productSatisfiesOption(opt, product))
                filteredProductOptions.add(opt);
        }
            
        return filteredProductOptions;
    }

    /**
     * Find a valid configuration for a product.
     * @param {string} optionTypeTitle The starting option type.
     * @param {KVMap<string, List<ProductOption>>} optionCandidates All possible product options. 
     * @param {Product} product The product to be configurated.
     */
    findValidConfiguration(optionTypeTitle: string, optionCandidates: KVMap<string, List<ProductOption>>, product: Product): boolean
    {
        // Save old option for backup
        let oldOption: ProductOption = product.getOption(optionTypeTitle);
        let nextOptionTypeTitle: string = null;

        // find next optionType for the next deepth
        if(optionCandidates.keys().indexOf(optionTypeTitle) < optionCandidates.keys().length-1)
            nextOptionTypeTitle = optionCandidates.keys().get(optionCandidates.keys().indexOf(optionTypeTitle) + 1);

        // Iterate through option candidates of the given option type
        for(let idx = 0; idx < optionCandidates.get(optionTypeTitle).length; idx ++)
        {
            // Pick next
            let option = optionCandidates.get(optionTypeTitle).get(idx);
            
            if(this.productSatisfiesOption(option, product))
            {
                // Set the product option
                this.setProductOption(option, product);
                
                // If there is a next option type, try to find a valid option withthe given actual configuration
                // Else, it's the last child in the tree. Return true
                if(nextOptionTypeTitle)
                {
                    if(this.findValidConfiguration(nextOptionTypeTitle, optionCandidates, product))
                        return true;
                }
                else
                    return true;
            }
        }

        // Reset the product setting the old option if a valid configuration couldn't be found
        product.setOption(oldOption);
        return false;
    }

    /**
     * Fills the missing product options that are required with the ones passed to the function. 
     * ProductOptions marked as default will be preferred.
     * If fillNotRequired is set to true, the options that are not required will also be filled.
     * @param {List<ProductOption>} allProductOptions The product options.
     * @param {bolean} [fillNotRequired=false] The option that defines if the products not required options will be filled as well.
     * @returns {boolean} True if the product could be filled with all required product options, else false.
     */
    fillMissingProductOptionsWithDefault(allProductOptions: List<ProductOption>, product: Product, fillNotRequired: boolean=false): boolean
    {
        let ret = true;
        
        let relevantOptionDefinitions = (fillNotRequired)?this.productDefinition.productOptionDefinitions:this.productDefinition.getRequiredProductOptionDefinitions();
        let unfilledOptionDefinitions = relevantOptionDefinitions.filter((optionDefinition)=>{return !product.hasOption(optionDefinition.type);});
        let productOptionCandidates: KVMap<string, List<ProductOption>> = new KVMap<string, List<ProductOption>>();

        // Init productOptionCandidates list
        for(let idx = 0; idx < unfilledOptionDefinitions.length; idx++)
        {
            let productOptionDefinition = unfilledOptionDefinitions.get(idx);
            productOptionCandidates.add(productOptionDefinition.type, this.filterValidOptions(allProductOptions, product));
        }

        // Sort the candidates, default first
        for(let idx = 0; idx < productOptionCandidates.keys().length; idx++)
        {
            let sortedList = new List<ProductOption>();
            productOptionCandidates.get(productOptionCandidates.keys().get(idx)).foreach((option)=>{
                if(option.hasTag("default"))
                    sortedList.add(option);
            });

            productOptionCandidates.get(productOptionCandidates.keys().get(idx)).foreach((option)=>{
                if(!option.hasTag("default"))
                    sortedList.add(option);
            });

            productOptionCandidates.add(productOptionCandidates.keys().get(idx), sortedList);
        }

        // Find a valid combination
        return this.findValidConfiguration(productOptionCandidates.keys().first(), productOptionCandidates, product);
    }

    /**
     * Set a product option. If complications appear with lower ranked product options, reject the operation.
     * @param {ProductOption} productOption The product option to be set.
     * @returns {boolean} True if no complications appeared, else false.
     */
    setOptionOrRejectOnComplications(productOption: ProductOption, product: Product): boolean
    {
        let oldOption = product.getOption(productOption.type.title);

        if(!this.setProductOption)
            return false;

        if(this.nextUnsatisfiedOption(product))
            product.setOption(oldOption);
    }

    /**
     * Set a product option. If complications appear with lower ranked product options, remove them.
     * @param {ProductOption} productOption The product option to be set.
     * @returns {boolean} True if no complications appeared, else false.
     */
    setOptionAndRemoveOtherOptionsOnComplications(productOption: ProductOption, product: Product): boolean
    {
        if(!this.setProductOption)
            return false;
        
        let toRemove = this.nextUnsatisfiedOption(product);
        while(toRemove)
        {
            product.removeOption(toRemove.type.title);
            toRemove = this.nextUnsatisfiedOption(product);
        }
        
        return true;
    }

    setOptionsAndDefaultOnComplications(productOption: ProductOption, product: Product, productOptions: List<ProductOption>, fillNotRequired: boolean=false)
    {
        this.setOptionAndRemoveOtherOptionsOnComplications(productOption, product);
        this.fillMissingProductOptionsWithDefault(productOptions, product, fillNotRequired);
    }

    productIsValid(product: Product): boolean
    {
        if(this.nextUnsatisfiedOption(product))
            return false;
        return true;
    }

    productSatisfiesOption(productOption: ProductOption, product: Product)
    {
        let productOptionDefinition: ProductOptionDefinition;
        let relevantCombinations: List<Combination>;
        let foundValidCombination = false;

        // find the definition that belongs to this option (by type/name)
        this.productDefinition.getProductOptionDefinition(productOption.type.title);

        if(!productOptionDefinition)
            throw Error("Unknown option");

        // filter for the combinations that match the tags of the given option. Only those are relevant
        relevantCombinations = productOptionDefinition.combinations.filter((combination)=>{
            return combination.tags.isSublistOf(productOption.tags);
        });

        // iterate through the relevant combinations
        relevantCombinations.foreach((combination)=>{
            // If a combination has no requirements, it's a save match
            // Else, check if all requirements of the given combination are fulfilled by the product
            if(combination.requirements.isEmpty())
                foundValidCombination = true;
            else
            {
                let requirementsFulfilled = true;
                // Iterate through all requirements for this combination
                combination.requirements.foreach((requirement)=>{
                    // Pick the product option from the product this requirement refers to
                    let productOption = product.getOption(requirement.productOptionType);
                    
                    // If the product odesn'thave the necessary option, the requirements for this combination can not be fulfilled
                    if(!productOption)
                        requirementsFulfilled = false;
                    // Else, check if the productOption contains the necessary tags in order to satisfy the requirement for the new product option
                    else
                        if(!requirement.tags.isSublistOf(productOption.tags))
                            requirementsFulfilled = false;
                });
                // If requirements fulfilled, found a valid combination
                if(requirementsFulfilled)
                    foundValidCombination = true;
            }
        });

        return foundValidCombination;
    }

    private nextUnsatisfiedOption(product: Product): ProductOption | null
    {
        for(let idx = 0; idx < product.options.length; idx++)
            if(!this.productSatisfiesOption(product.options.get(idx), product))
                return product.options.get(idx);

        return null;
    }
    
    set productDefinition(productDefinition: ProductDefinition)
    {
        this._productDefinition = productDefinition;
    }

    get productDefinition(): ProductDefinition
    {
        return this._productDefinition;
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

    setProductOptionDefinition(productOptionDefinition: ProductOptionDefinition): void
    {
        this._productOptionDefinitions.add(productOptionDefinition.type, productOptionDefinition);
    }

    getProductOptionDefinition(type: string): ProductOptionDefinition
    {
        return this._productOptionDefinitions.get(type);
    }

    getRequiredProductOptionDefinitions(): List<ProductOptionDefinition>
    {
        return this.productOptionDefinitions.filter((def)=>{return def.required;});
    }

    removeProductOptionDefinition(type: string): void
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
        productOptionDefinitions.foreach((definition)=>{this.setProductOptionDefinition(definition)});
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

class ProductOptionDefinition
{
    private _type: string;
    private _required: boolean;
    private _combinations: List<Combination>;
    
    constructor(type: string, required: boolean, combinations?: List<Combination>)
    {
        this.type = type;
        this.required = required;
        this.combinations = combinations;
    }

    addCombination(combination: Combination): void
    {
        this._combinations.add(combination);
    }

    removeCombination(combination: Combination): void
    {
        this.combinations.remove(this.combinations.indexOf(combination));
    }

    set type(type: string)
    {
        this._type = type;
    }

    set required(required: boolean)
    {
        this._required = required;
    }

    set combinations(combinations: List<Combination>)
    {
        if(combinations)
            this._combinations = combinations;
        else
            this._combinations = new List<Combination>();
    }

    get type(): string
    {
        return this._type;
    }

    get required(): boolean
    {
        return this._required;
    }

    get combinations(): List<Combination>
    {
        return this._combinations;
    }
}

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

class CombinationRequirement
{
    private _productOptionType: string;
    private _tags: List<string>;

    constructor(productOptionType: string, tags?: List<string>)
    {
        this.productOptionType = productOptionType;
        this.tags = tags;
    }

    addTag(tag: string): void
    {
        this.tags.add(tag);
    }

    removeTag(tag: string): void
    {
        this.tags.remove(this.tags.indexOf(tag));
    }

    set productOptionType(productOptionType: string)
    {
        this._productOptionType = productOptionType;
    }

    set tags(tags: List<string>)
    {
        if(tags)
            this._tags = tags;
        else
            this._tags = new List<string>();
    }

    get productOptionType(): string
    {
        return this._productOptionType;
    }

    get tags(): List<string>
    {
        return this._tags;
    }
}

function parseProductDefinitions(productDefObj: Object): List<ProductDefinition>
{
    let productDefinitions = new List<ProductDefinition>();
    for(var key1 in productDefObj)
    {   
        let productDef = productDefObj[key1];
        let productDefinition = new ProductDefinition(productDef.model);
        
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
                "required": true,
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
                "required": true,
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
                "required": true,
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
                "required": true,
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
                "required": true,
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
                "required": true,
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