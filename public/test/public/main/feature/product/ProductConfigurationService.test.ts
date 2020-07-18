import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import ProductDefinitionParsingService from "../../../../../main/feature/product/service/ProductDefinitionParsingService";
import ProductConfigurationService from "../../../../../main/feature/product/service/ProductConfigurationService";
import Product from "../../../../../main/feature/product/model/Product";
import ProductOption from "../../../../../main/feature/product/model/ProductOption";
import List from "../../../../../main/common/util/collections/list/List";
import ProductOptionType from "../../../../../main/feature/product/model/ProductOptionType";
import Tag from "../../../../../main/feature/product/model/Tag";
import KVMap from "../../../../../main/common/util/collections/map/KVMap";
import InvalidOperationError from "../../../../../main/common/util/error/InvalidOperationError";

const PATH = "test/public/main/feature/product/ProductConfigurationService.test.js"

const productDefinitions =
{
    0: 
    {
        "productModel": "fenster",
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
                    } 
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
                        "tags": ["kunststoff"],
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
                        "tags": ["holz"],
                        "requirements": 
                        {
                            0:
                            {
                                "productOptionType":"material",
                                "tags": ["holz"]
                            }
                        }
                    }
                }
            },
            2:
            {
                "type": "rolläden",
                "required": false,
                "combinations":
                {
                    0:
                    {
                        "tags": ["außen"],
                        "requirements": {}
                    }
                }
            }
        }
    } 
}

var product: Product;

const productDefinition = ProductDefinitionParsingService.parseFromJson(productDefinitions).first();
if(!productDefinition)
    throw new InvalidOperationError(PATH, "", "productDefinition is undefined after parsing from json!");
const productConfigurationService = new ProductConfigurationService(productDefinition);

export async function runAllTests()
{
    let tests = new Tests(undefined, undefined, beforeEach, afterEach);
    
    tests.add(new Test(PATH, "product satisfies option", truthly(), productSatisfiesOption));
    tests.add(new Test(PATH, "product is valid", truthly(), productIsValid));
    tests.add(new Test(PATH, "filter valid options", truthly(), filterValidOptions));
    tests.add(new Test(PATH, "find valid configuration", truthly(), findValidConfiguration));
    tests.add(new Test(PATH, "fill missing product options with default", truthly(), fillMissingProductOptionsWithDefault));
    
    await tests.runAll();
}

async function beforeEach()
{
    let materialOption = new ProductOption();
    let profilOption = new ProductOption();
    let rolladenOption = new ProductOption();

    materialOption.productOptionType = new ProductOptionType({"title": "material"});
    profilOption.productOptionType = new ProductOptionType({"title": "profil"});
    rolladenOption.productOptionType = new ProductOptionType({"title": "rolläden"});

    materialOption.tags = new List<Tag>([new Tag({"title": "kunststoff"}), new Tag({"title": "5-Kammer"})]);
    profilOption.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    rolladenOption.tags = new List<Tag>([new Tag({"title": "außen"})]);

    product = new Product(new List<ProductOption>([
        materialOption,
        profilOption,
        rolladenOption
    ]));
}

async function afterEach()
{
    
}

function productSatisfiesOption()
{
    let validOption = new ProductOption();
    let invalidOption = new ProductOption();

    validOption.productOptionType = new ProductOptionType({"title": "profil"});
    invalidOption.productOptionType = new ProductOptionType({"title": "profil"});

    validOption.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    invalidOption.tags = new List<Tag>([new Tag({"title": "holz"})]);

    if(!productConfigurationService.productSatisfiesOption(validOption, product))
        return false;

    if(productConfigurationService.productSatisfiesOption(invalidOption, product))
        return false;

    return true;
}

function productIsValid()
{
    if(!productConfigurationService.productIsValid(product))
        return false;

    let option = product.getOption("profil");
    if(!option)
        throw new InvalidOperationError(PATH, "productIsValid", "Wrong test configuration!!!");

    option.tags = new List<Tag>([new Tag({"title": "no Kunststoff Tag"})]);
    if(productConfigurationService.productIsValid(product))
        return false;

    return true;
}

function filterValidOptions()
{
    let validOption1 = new ProductOption({"id": "1"});
    let invalidOption = new ProductOption({"id": "2"});
    let validOption2 = new ProductOption({"id": "3"});

    validOption1.productOptionType = new ProductOptionType({"title": "profil"});
    invalidOption.productOptionType = new ProductOptionType({"title": "profil"});
    validOption2.productOptionType = new ProductOptionType({"title": "profil"});

    validOption1.tags = new List<Tag>([new Tag({"title": "kunststoff"}), new Tag({"title": "kunstfurz"})]);
    invalidOption.tags = new List<Tag>([new Tag({"title": "holz"})]);
    validOption2.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);

    let options = new List<ProductOption>([validOption1, invalidOption, validOption2]);

    let filteredOptions = productConfigurationService.filterValidOptions(options, product);
    
    if(filteredOptions.length !== 2)
        return false;

    if(!(filteredOptions.has(validOption1) && filteredOptions.has(validOption2)))
        return false;
    
    return true;
}

function findValidConfiguration()
{
    let optionCandidates = new KVMap<string, List<ProductOption>>();

    let materialOption1 = new ProductOption({"id": "1"});
    let materialOption2 = new ProductOption({"id": "2"});
    let profilOption1 = new ProductOption({"id": "3"});
    let profilOption2 = new ProductOption({"id": "4"});
    let profilOption3 = new ProductOption({"id": "5"});
    
    materialOption1.productOptionType = new ProductOptionType({"title": "material"});
    materialOption2.productOptionType = new ProductOptionType({"title": "material"});
    profilOption1.productOptionType = new ProductOptionType({"title": "profil"});
    profilOption2.productOptionType = new ProductOptionType({"title": "profil"});
    profilOption3.productOptionType = new ProductOptionType({"title": "profil"});
    
    materialOption1.tags = new List<Tag>([new Tag({"title": "marius"})]);
    materialOption2.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    profilOption1.tags = new List<Tag>([new Tag({"title": "holz"})]);
    profilOption2.tags = new List<Tag>([new Tag({"title": "kunststoff"}), new Tag({"title": "kunstfurz"})]);
    profilOption3.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);

    optionCandidates.add("material", new List<ProductOption>([materialOption1, materialOption2]));
    optionCandidates.add("profil", new List<ProductOption>([profilOption1, profilOption2, profilOption3]));

    product.removeOption("material");
    product.removeOption("profil");

    productConfigurationService.findValidConfiguration("material", optionCandidates, product);
    if(!(product.hasOption("material") && product.hasOption("profil") && product.hasOption("rolläden")))
        return false;

    if(!product.getOption("material").equals(materialOption2))
        return false;

    if(!product.getOption("profil").equals(profilOption2))
        return false;
    
    return true;
}

function fillMissingProductOptionsWithDefault()
{
    let optionCandidates = new List<ProductOption>();

    let materialOption1 = new ProductOption({"id": "1"});
    let materialOption2 = new ProductOption({"id": "2"});
    let profilOption1 = new ProductOption({"id": "3"});
    let profilOption2 = new ProductOption({"id": "4"});
    let profilOption3 = new ProductOption({"id": "5"});
    
    materialOption1.productOptionType = new ProductOptionType({"title": "material"});
    materialOption2.productOptionType = new ProductOptionType({"title": "material"});
    profilOption1.productOptionType = new ProductOptionType({"title": "profil"});
    profilOption2.productOptionType = new ProductOptionType({"title": "profil"});
    profilOption3.productOptionType = new ProductOptionType({"title": "profil"});
    
    materialOption1.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    materialOption2.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    profilOption1.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);
    profilOption2.tags = new List<Tag>([new Tag({"title": "kunststoff"}), new Tag({"title": "kunstfurz"}), new Tag({"title": "default"})]);
    profilOption3.tags = new List<Tag>([new Tag({"title": "kunststoff"})]);

    optionCandidates.add(materialOption1, materialOption2, profilOption1, profilOption2, profilOption3);

    product.setOption(materialOption2);
    product.removeOption("profil");

    productConfigurationService.fillMissingProductOptionsWithDefault(optionCandidates, product);
    
    if(!(product.hasOption("material") && product.hasOption("profil") && product.hasOption("rolläden")))
        return false;

    if(!product.getOption("material").equals(materialOption2))
        return false;

    if(!product.getOption("profil").equals(profilOption2))
        return false;
    
    return true;
}

