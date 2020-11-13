import List from "../../../../common/util/collections/list/List";
import KVMap from "../../../../common/util/collections/map/KVMap";
import ProductDefinition from "../../model/ProductDefinition";
import ProductOption from "../../model/ProductOption";
import ProductOptionDefinition from "../../model/ProductOptionDefinition";
import Combination from "../../model/Combination";
import CombinationRequirement from "../../model/CombinationRequirement";
import ProductConfiguration from "../../model/ProductConfiguration";
import InvalidOperationError from "../../../../common/util/error/InvalidOperationError";
import { FensterTags } from "../../tags";

const PATH = "public/main/feature/product/service/ProductConfigurationService.js";

abstract class AbstractProductConfigurationService
{
    private _productDefinition: ProductDefinition;

    constructor (productDefinition: ProductDefinition)
    {
        this.productDefinition = productDefinition;
    }

    /**
     * A hook function which allows to perform operations on the product before setting an option.
     * @param {ProductOption} productOption The ProductOption that will be set. 
     * @param {Product} product The product for which the option will be set.
     */
    abstract beforeSetOption(productOption: ProductOption, product: ProductConfiguration): void;

    /**
     * A hook function which allows to perform operations on the product after setting an option.
     * @param {ProductOption} productOption The ProductOption that will be set. 
     * @param {Product} product The product for which the option will be set.
     */
    abstract afterSetOption(productOption: ProductOption, product: ProductConfiguration): void;

    /**
     * Calculates the price of the given product.
     * @param {Product} product The product for which the price will be calculated.
     * @returns {Promise<number>} The calculated price. 
     */
    abstract async calculatePrice(product: ProductConfiguration): Promise<number>;

    /**
     * Calculates and sets the new price.
     * @param {Product} product The product for which the price will be calculated.
     * @returns {Promise<number>} The calculated price. 
     */
    async calculateAndSetPrice(product: ProductConfiguration): Promise<number>
    {
        product.price = await this.calculatePrice(product);
        return product.price;
    }

    /**
     * Set a product option.
     * @param productOption The product option to be set.
     * @returns {boolean} True if the option has been set or false, if the option couldn't be set due to complications with higher ranked options.
     */
    setProductOption(productOption: ProductOption, product: ProductConfiguration): boolean
    {
        if (this.productSatisfiesOption(productOption, product))
        {
            this.beforeSetOption(productOption, product);
            product.saveOption(productOption);
            this.afterSetOption(productOption, product);
        }
        else
            return false;
        return true;
    }

    /**
     * Filter the passed options for those that are valid. If a type parameter is passed, filter only for those options of the given type.
     * @param {string} [productOptionTypeTile] The type to be filtered for.
     * @returns {List<ProductOption>} A list containing all valid options considering the request.
     */
    filterValidOptions(allProductOptions: List<ProductOption>, product: ProductConfiguration, productOptionTypeTitle?: string): List<ProductOption>
    {
        let relevantProductOptions = allProductOptions;
        const filteredProductOptions = new List<ProductOption>();

        if (productOptionTypeTitle)
            relevantProductOptions = allProductOptions.filter((option) => { return option.productOptionType.title === productOptionTypeTitle; });

        relevantProductOptions.foreach((opt) =>
        {
            if (this.productSatisfiesOption(opt, product))
                filteredProductOptions.add(opt);
        });

        return filteredProductOptions;
    }

    /**
     * Find a valid configuration for a product.
     * @param {string} startOptionTypeTitle The starting option type.
     * @param {KVMap<string, List<ProductOption>>} optionCandidates All possible product options. 
     * @param {Product} product The product to be configurated.
     * @returns {boolean} True if a valid configuration was found, else false.
     */
    findValidConfiguration(startOptionTypeTitle: string, optionCandidates: KVMap<string, List<ProductOption>>, product: ProductConfiguration): boolean
    {
        const oldOption: ProductOption | undefined = (product.hasOption(startOptionTypeTitle)) ? product.getOption(startOptionTypeTitle) : undefined;
        const optionCandidatesList: List<ProductOption> = optionCandidates.get(startOptionTypeTitle);
        let nextOptionTypeTitle: string | undefined;

        // find next optionType for the next deepth
        try
        {
            nextOptionTypeTitle = optionCandidates.keys().get(optionCandidates.keys().indexOf(startOptionTypeTitle) + 1);
        } catch (err)
        {
            // A next doesn't exist.
            nextOptionTypeTitle = undefined;
        }

        // Iterate through option candidates of the given option type
        for (let idx = 0; idx < optionCandidatesList.length; idx++)
        {
            // Pick next
            const option = optionCandidatesList.get(idx);

            if (this.productSatisfiesOption(option, product))
            {

                // Set the product option
                this.setProductOption(option, product);

                // If there is a next option type, try to find a valid option withthe given actual configuration
                // Else, it's the last child in the tree. Return true
                if (nextOptionTypeTitle)
                {
                    if (this.findValidConfiguration(nextOptionTypeTitle, optionCandidates, product))
                        return true;
                }
                else
                    return true;
            }
        }

        // Reset the product setting the old option if a valid configuration couldn't be found
        if (oldOption)
            product.saveOption(oldOption);
        else
            product.removeOption(startOptionTypeTitle);
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
    fillMissingProductOptionsWithDefault(allProductOptions: List<ProductOption>, product: ProductConfiguration, fillNotRequired: boolean = false): boolean
    {
        const ret = true;
        const relevantOptionDefinitions = (fillNotRequired) ? this.productDefinition.productOptionDefinitions : this.productDefinition.getRequiredProductOptionDefinitions();
        const unfilledOptionDefinitions = relevantOptionDefinitions.filter((optionDefinition) => { return !product.hasOption(optionDefinition.type); });
        const productOptionCandidates: KVMap<string, List<ProductOption>> = new KVMap<string, List<ProductOption>>();

        // Init productOptionCandidates list
        unfilledOptionDefinitions.foreach((productOptionDefinition) =>
        {
            productOptionCandidates.add(productOptionDefinition.type, allProductOptions.filter(opt => opt.productOptionType.title === productOptionDefinition.type));
        });

        // Sort the candidates, default first
        productOptionCandidates.foreach((key, productOptionCandidatesList) =>
        {
            const sortedList = new List<ProductOption>();

            productOptionCandidatesList.foreach((option) =>
            {
                if (option.hasTagOfTitle(FensterTags.PREFERRED))
                    sortedList.add(option);
            });

            productOptionCandidatesList.foreach((option) =>
            {
                if (!option.hasTagOfTitle(FensterTags.PREFERRED))
                    sortedList.add(option);
            });

            productOptionCandidates.add(key, sortedList);
        });

        // Find a valid combination
        if (productOptionCandidates.isEmpty())
            return false;


        return this.findValidConfiguration(productOptionCandidates.keys().first(), productOptionCandidates, product);
    }

    /**
     * Set a product option. If complications appear with lower ranked product options, reject the operation.
     * @param {ProductOption} productOption The product option to be set.
     * @returns {boolean} True if no complications appeared, else false.
     */
    setOptionOrRejectOnComplications(productOption: ProductOption, product: ProductConfiguration): boolean
    {
        const oldOption = product.getOption(productOption.productOptionType.title);
        if (!this.setProductOption(productOption, product))
            return false;

        if (this.nextUnsatisfiedOption(product))
        {
            if (oldOption)
                product.saveOption(oldOption);
            return false;
        }

        return true;
    }

    /**
     * Set a product option. If complications appear with lower ranked product options, remove them.
     * @param {ProductOption} productOption The product option to be set.
     * @returns {boolean} True if no complications appeared, else false.
     */
    setOptionAndRemoveOtherOptionsOnComplications(productOption: ProductOption, product: ProductConfiguration): boolean
    {
        if (!this.setProductOption(productOption, product))
            return false;

        let toRemove = this.nextUnsatisfiedOption(product);
        while (toRemove)
        {
            product.removeOption(toRemove.productOptionType.title);
            toRemove = this.nextUnsatisfiedOption(product);
        }

        return true;
    }

    /**
     * Sets the given option and removes options that don't match with the new option.
     * Fills the products missing options with dafault ones.
     * @param {ProductOption} productOption The productOption to be set.
     * @param {Product} product The product to be configured.
     * @param {List<ProductOption>} productOptions A list containing the productOptions that will be used for default filling.
     * @param {boolean} fillNotRequired Defines of either to fill optional options with default or not.
     * @returns {boolean} True if the configured product is valid, else false.
     */
    setOptionAndDefaultOnComplications(productOption: ProductOption, product: ProductConfiguration, productOptions: List<ProductOption>, fillNotRequired: boolean = false): boolean
    {
        this.setOptionAndRemoveOtherOptionsOnComplications(productOption, product);
        this.fillMissingProductOptionsWithDefault(productOptions, product, fillNotRequired);
        return this.productIsValid(product);
    }

    productIsValid(product: ProductConfiguration): boolean
    {
        if (this.nextUnsatisfiedOption(product))
            return false;
        return true;
    }

    productSatisfiesOption(productOption: ProductOption, product: ProductConfiguration)
    {
        let productOptionDefinition: ProductOptionDefinition;
        let relevantCombinations: List<Combination>;
        let foundValidCombination = false;

        // find the definition that belongs to this option (by type/name)
        productOptionDefinition = this.productDefinition.getProductOptionDefinition(productOption.productOptionType.title);

        // filter for the combinations that match the tags of the given option. Only those are relevant
        relevantCombinations = productOptionDefinition.combinations.filter((combination) =>
        {
            return combination.tags.isSublistOf(productOption.tags.pluck("title"));
        });

        // iterate through the relevant combinations
        relevantCombinations.foreach((combination) =>
        {
            // If a combination has no requirements, it's a save match
            // Else, check if all requirements of the given combination are fulfilled by the product
            if (combination.requirements.isEmpty())
                foundValidCombination = true;
            else
            {
                let requirementsFulfilled = true;
                // Iterate through all requirements for this combination
                combination.requirements.foreach((requirement) =>
                {
                    // Pick the product option from the product this requirement refers to

                    // If the product odesn'thave the necessary option, the requirements for this combination can not be fulfilled
                    if (!product.hasOption(requirement.productOptionType))
                        requirementsFulfilled = false;
                    // Else, check if the productOption contains the necessary tags in order to satisfy the requirement for the new product option
                    else
                    {
                        const newProductOption = product.getOption(requirement.productOptionType);
                        if (!requirement.tags.isSublistOf(newProductOption.tags.pluck("title")))
                            requirementsFulfilled = false;
                    }
                });
                // If requirements fulfilled, found a valid combination
                if (requirementsFulfilled)
                    foundValidCombination = true;
            }
        });

        return foundValidCombination;
    }

    private nextUnsatisfiedOption(product: ProductConfiguration): ProductOption | null
    {
        for (let idx = 0; idx < product.productOptions.length; idx++)
            if (!this.productSatisfiesOption(product.productOptions.get(idx), product))
                return product.productOptions.get(idx);

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

export default AbstractProductConfigurationService;