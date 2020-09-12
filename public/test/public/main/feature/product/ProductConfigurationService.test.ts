import { Tests, Test, truthly } from "../../../../../main/common/test/Test";
import ProductDefinitionParsingService from "../../../../../main/feature/product/service/ProductDefinitionParsingService";
import AbstractProductConfigurationService from "../../../../../main/feature/product/service/configurator/AbstractProductConfigurationService";
import Product from "../../../../../main/feature/product/model/Product";
import ProductOption from "../../../../../main/feature/product/model/ProductOption";
import List from "../../../../../main/common/util/collections/list/List";
import ProductOptionType from "../../../../../main/feature/product/model/ProductOptionType";
import KVMap from "../../../../../main/common/util/collections/map/KVMap";
import InvalidOperationError from "../../../../../main/common/util/error/InvalidOperationError";
import FensterProductConfigurationService from "../../../../../main/feature/product/service/configurator/FensterProductConfigurationService";
import QueryResult from "../../../../../main/common/orm/QueryResult";
import Tag from "../../../../../main/feature/product/model/Tag";
import { ProductModels } from "../../../../../main/feature/product/productModels";
import { FensterProductOptionTypes } from "../../../../../main/feature/product/productOptionTypes";
import { FensterTags } from "../../../../../main/feature/product/tags";

const PATH = "test/public/main/feature/product/ProductConfigurationService.test.js"

const productDefinitions =
{
    0:
    {
        "productModel": ProductModels.FENSTER,
        "productOptionDefinitions":
        {
            0:
            {
                "type": FensterProductOptionTypes.MATERIAL,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.KUNSTSTOFF],
                        "requirements": {}
                    },
                    1:
                    {
                        "tags": [FensterTags.HOLZ],
                        "requirements": {}
                    }
                }
            },
            1:
            {
                "type": FensterProductOptionTypes.PROFIL,
                "required": true,
                "combinations":
                {
                    0:
                    {
                        "tags": [FensterTags.KUNSTSTOFF],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.MATERIAL,
                                "tags": [FensterTags.KUNSTSTOFF]
                            }
                        }
                    },
                    1:
                    {
                        "tags": [FensterTags.HOLZ],
                        "requirements":
                        {
                            0:
                            {
                                "productOptionType": FensterProductOptionTypes.MATERIAL,
                                "tags": [FensterTags.HOLZ]
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

let product: Product;

const productDefinition = ProductDefinitionParsingService.parseFromJson(productDefinitions).get(ProductModels.FENSTER);
if (!productDefinition)
    throw new InvalidOperationError(PATH, "", "productDefinition is undefined after parsing from json!");
const productConfigurationService = new FensterProductConfigurationService(productDefinition);





export async function runAllTests() {
    const tests = new Tests(undefined, undefined, beforeEach, afterEach);

    tests.add(new Test(PATH, "product satisfies option", truthly(), productSatisfiesOption));
    tests.add(new Test(PATH, "product is valid", truthly(), productIsValid));
    tests.add(new Test(PATH, "filter valid options", truthly(), filterValidOptions));
    tests.add(new Test(PATH, "find valid configuration", truthly(), findValidConfiguration));
    tests.add(new Test(PATH, "fill missing product options with default", truthly(), fillMissingProductOptionsWithDefault));
    tests.add(new Test(PATH, "fill missing product options with invalid default", truthly(), fillMissingProductOptionsWithInvalidDefault));


    await tests.runAll();
}

async function beforeEach() {
    const materialOption = new ProductOption();
    const profilOption = new ProductOption();
    const rolladenOption = new ProductOption();

    materialOption.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    profilOption.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    rolladenOption.productOptionType = new ProductOptionType({ "title": "rolläden" });

    materialOption.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF }), new Tag({ "title": "5-Kammer" })]);
    profilOption.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    rolladenOption.tags = new QueryResult<Tag>([new Tag({ "title": "außen" })]);

    product = new Product();
    product.productOptions = new QueryResult([materialOption, profilOption, rolladenOption]);
}

async function afterEach() {

}

function productSatisfiesOption() {
    const validOption = new ProductOption();
    const invalidOption = new ProductOption();

    validOption.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    invalidOption.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });

    validOption.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF }), new Tag({ "title": FensterTags.KOEMMERLING })]);
    invalidOption.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.HOLZ })]);

    if (!productConfigurationService.productSatisfiesOption(validOption, product)) {
        console.log('first if');
        console.log(validOption, 'valid option');
        console.log(product, 'product');
        console.log(productConfigurationService.productDefinition, 'productDefinition');
        return false;
    }

    if (productConfigurationService.productSatisfiesOption(invalidOption, product))
        return false;

    return true;
}

function productIsValid() {
    if (!productConfigurationService.productIsValid(product)) {
        console.log('first if');
        console.log(product, 'product');
        console.log(productConfigurationService.productDefinition, 'productDefinition');
        return false;
    }

    const option = product.getOption(FensterProductOptionTypes.PROFIL);
    if (!option)
        throw new InvalidOperationError(PATH, "productIsValid", "Wrong test configuration!!!");

    option.tags = new QueryResult<Tag>([new Tag({ "title": "no Kunststoff Tag" })]);
    if (productConfigurationService.productIsValid(product))
        return false;

    return true;
}

function filterValidOptions() {
    const validOption1 = new ProductOption({ "id": "1" });
    const invalidOption = new ProductOption({ "id": "2" });
    const validOption2 = new ProductOption({ "id": "3" });

    validOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    invalidOption.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    validOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });

    validOption1.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF }), new Tag({ "title": "kunstfurz" })]);
    invalidOption.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.HOLZ })]);
    validOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);

    const options = new List<ProductOption>([validOption1, invalidOption, validOption2]);

    const filteredOptions = productConfigurationService.filterValidOptions(options, product);

    if (filteredOptions.length !== 2)
        return false;

    if (!(filteredOptions.has(validOption1) && filteredOptions.has(validOption2)))
        return false;

    return true;
}

function findValidConfiguration() {
    const optionCandidates = new KVMap<string, List<ProductOption>>();

    const materialOption1 = new ProductOption({ "id": "1" });
    const materialOption2 = new ProductOption({ "id": "2" });
    const profilOption1 = new ProductOption({ "id": "3" });
    const profilOption2 = new ProductOption({ "id": "4" });
    const profilOption3 = new ProductOption({ "id": "5" });

    materialOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    materialOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    profilOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption3.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });

    materialOption1.tags = new QueryResult<Tag>([new Tag({ "title": "marius" })]);
    materialOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    profilOption1.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.HOLZ })]);
    profilOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF }), new Tag({ "title": "kunstfurz" })]);
    profilOption3.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);

    optionCandidates.add(FensterProductOptionTypes.MATERIAL, new QueryResult<ProductOption>([materialOption1, materialOption2]));
    optionCandidates.add(FensterProductOptionTypes.PROFIL, new QueryResult<ProductOption>([profilOption1, profilOption2, profilOption3]));

    product.removeOption(FensterProductOptionTypes.MATERIAL);
    product.removeOption(FensterProductOptionTypes.PROFIL);

    productConfigurationService.findValidConfiguration(FensterProductOptionTypes.MATERIAL, optionCandidates, product);
    if (!(product.hasOption(FensterProductOptionTypes.MATERIAL) && product.hasOption(FensterProductOptionTypes.PROFIL) && product.hasOption("rolläden")))
        return false;

    if (!product.getOption(FensterProductOptionTypes.MATERIAL).equals(materialOption2))
        return false;

    if (!product.getOption(FensterProductOptionTypes.PROFIL).equals(profilOption2))
        return false;

    return true;
}

function fillMissingProductOptionsWithDefault() {
    const optionCandidates = new List<ProductOption>();

    const materialOption1 = new ProductOption({ "id": "1" });
    const materialOption2 = new ProductOption({ "id": "2" });
    const profilOption1 = new ProductOption({ "id": "3" });
    const profilOption2 = new ProductOption({ "id": "4" });
    const profilOption3 = new ProductOption({ "id": "5" });

    materialOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    materialOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    profilOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption3.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });

    materialOption1.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    materialOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    profilOption1.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    profilOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF }), new Tag({ "title": "kunstfurz" }), new Tag({ "title": FensterTags.PREFERRED })]);
    profilOption3.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);

    optionCandidates.add(materialOption1, materialOption2, profilOption1, profilOption2, profilOption3);

    product.saveOption(materialOption2);
    product.removeOption(FensterProductOptionTypes.PROFIL);

    productConfigurationService.fillMissingProductOptionsWithDefault(optionCandidates, product);

    if (!(product.hasOption(FensterProductOptionTypes.MATERIAL) && product.hasOption(FensterProductOptionTypes.PROFIL) && product.hasOption("rolläden")))
        return false;

    if (!product.getOption(FensterProductOptionTypes.MATERIAL).equals(materialOption2))
        return false;

    if (!product.getOption(FensterProductOptionTypes.PROFIL).equals(profilOption2))
        return false;

    return true;
}

function fillMissingProductOptionsWithInvalidDefault() {
    const optionCandidates = new List<ProductOption>();

    const materialOption1 = new ProductOption({ "id": "1" });
    const materialOption2 = new ProductOption({ "id": "2" });
    const profilOption1 = new ProductOption({ "id": "3" });
    const profilOption2 = new ProductOption({ "id": "4" });
    const profilOption3 = new ProductOption({ "id": "5" });

    materialOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    materialOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.MATERIAL });
    profilOption1.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption2.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });
    profilOption3.productOptionType = new ProductOptionType({ "title": FensterProductOptionTypes.PROFIL });

    materialOption1.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    materialOption2.tags = new QueryResult<Tag>([new Tag({ "title": FensterTags.KUNSTSTOFF })]);
    profilOption1.tags = new QueryResult<Tag>([new Tag({ "title": "unknownMat" })]);
    profilOption2.tags = new QueryResult<Tag>([new Tag({ "title": "unknownMat" }), new Tag({ "title": "kunstfurz" }), new Tag({ "title": FensterTags.PREFERRED })]);
    profilOption3.tags = new QueryResult<Tag>([new Tag({ "title": "unknownMat" })]);

    optionCandidates.add(materialOption1, materialOption2, profilOption1, profilOption2, profilOption3);

    product.saveOption(materialOption2);
    product.removeOption(FensterProductOptionTypes.PROFIL);

    const success = productConfigurationService.fillMissingProductOptionsWithDefault(optionCandidates, product);

    if (success) {
        console.log('first if');
        console.log(product, 'product');
        console.log(optionCandidates, 'optionCandidates');
        console.log(productConfigurationService.productDefinition, 'productDefinition');
        return false;
    }

    return true;
}



