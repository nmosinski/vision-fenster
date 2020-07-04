const PATH = "public/src/main/common/wixData/WixDataModel.js";

import KVMap from "../util/collections/map/KVMap.js"
import List from "../util/collections/list/List.js"

import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"
import VariableValueError from "public/src/main/common/util/error/VariableValueError.js"
import ItemNotFoundError from "public/src/main/common/wixData/ItemNotFoundError.js"

import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"

import WixData from "public/src/main/common/wixData/WixData.js"
import WixDataRepository from "./WixDataRepository";

/**
 * @class
 * A class representing an WixDataModel (collection).
 */
class WixDataModel
{
	private _name: string;
	private _associations: KVMap<string, KVMap<string, WixDataModel>>;
	private _wixDataRepository: WixDataRepository;
	/**
	 * Create a WixDataModel.
	 * @param {string} name - The name of the collection this repository is pointing to.
	 * @param {KVMap<string,string>} [mapping=null] The mapping between the js object and the wix db item (object key -> item key). Empty if identical mapping.
	 * @param {boolean} [authorisation=true] Defines if authorisation should be done.
	 * @param {boolean} [hooks=true] Defines if hooks should be considered.
	 */
	constructor(name: string)
	{	
		this.name = name;

		this.associations = new KVMap<string, KVMap<string,WixDataModel>>();
		this.associations.add("child", new KVMap<string,WixDataModel>());
		this.associations.add("children", new KVMap<string,WixDataModel>());
		this.associations.add("parent", new KVMap<string,WixDataModel>());
		this.associations.add("parents", new KVMap<string,WixDataModel>());

		this.wixDataRepository = new WixDataRepository(this.name, false, false);
	}


	async getOne(id: string): Promise<any>
	{
		let thisModel = await this.wixDataRepository.get(id);

		this.associations.get("child").keys().foreach(async function (modelName: string){
			thisModel[modelName] = await this.getChild(modelName);
		});

		this.associations.getMany("hasMany").foreach(async function (wixDataModel:WixDataModel){
			thisModel[wixDataModel.name] = await wixDataModel.getMany(thisModel[wixDataModel.name]);
		});
	}

	async getChild(name:string): Promise<any>
	{
		return await this.associations.get("child").get(name).getOne(this.name);
	}

	/*
	async getMany(query): Promise<List<any>>
	{
		let models = await this.wixDataRepository.find(query);
		return models;
	}
	*/

	hasHasOneAssociations(): boolean
	{
		return !this.associations.get("hasOne").isEmpty();
	}

	hasHasManyAssociations(): boolean
	{
		return !this.associations.get("hasMany").isEmpty();
	}

	hasBelongsToOneAssociations(): boolean
	{
		return !this.associations.get("belongsToOne").isEmpty();
	}

	hasBelongsToManyAssociations(): boolean
	{
		return !this.associations.get("belongsToMany").isEmpty();
	}


	/**
	 * Execute a query.
	 * @param {any} query The query to be executed.
	 * @return {Promise<Array<object>>} The resulting items of the executed query.
	 */
	async find(query: any): Promise<Array<any>>
	{
		if(JsTypes.isUnspecified(query))
			throw new VariableTypeError(PATH, "WixDataRepository.find()", query, "A wix-data query.");

		return query.find().then((result) => {
			let ret = [];
			for(let idx in result.items)
				ret.push(this._toObject(result.items[idx]));
			return ret;
		});
	} 

	/**
	 * Insert an item.
	 * @param {any} object An object representing the item to be inserted.
	 */
	async insert(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.insert()", object, "object");

		await WixData.insert(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Insert many items. If an item already exists, it will be overwritten.
	 * @param {List<any>} objects A List of objects representing the items to be saved.
	 */
	async insertMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.insertMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( object => {items.push(this._toItem(object));});

		await WixData.bulkInsert(this.collectionName, items, this._options);
	}

	/**
	 * Save an item. If the item already exists, it will be overwritten.
	 * @param {any} object An object representing the item to be saved.
	 */
	async save(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.save()", object, "Object.");
		
		await WixData.save(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Save many items. If an item already exists, it will be overwritten.
	 * @param {List<any>} objects A List of objects representing the items to be saved.
	 */
	async saveMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.saveMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( object => {items.push(this._toItem(object));});

		await WixData.bulkSave(this.collectionName, items, this._options);
	}

	/**
	 * Update an item.
	 * @param {any} object An object that describes the item to be updated.
	 */
	async update(object: any): Promise<void>
	{
		if(JsTypes.isUnspecified(object))
			throw new VariableTypeError(PATH, "WixDataRepository.update()", object, "any.");

		await WixData.update(this.collectionName, this._toItem(object), this._options);
	}

	/**
	 * Update many items.
	 * @param {List<any>} objects A List of objects representing the items to be updated.
	 */
	async updateMany(objects: List<any>): Promise<void>
	{
		if(!(objects instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.updateMany()", objects, "List<any>.");

		let items = [];

		objects.foreach( (object:any) => {items.push(this._toItem(object));});

		await WixData.bulkUpdate(this.collectionName, items, this._options);
	}

	/**
	 * Remove an item.
	 * @param {string} itemId The id of the item to be removed.
	 */
	async remove(itemId: string): Promise<void>
	{
		if(!JsTypes.isString(itemId))
			throw new VariableTypeError(PATH, "WixDataRepository.remove()", itemId, "string");
		if(JsTypes.isEmpty(itemId))
			throw new VariableValueError(PATH, "WixDataRepository.remove()", itemId, "The id of the item, not empty.");

		await WixData.remove(this.collectionName, itemId, this._options);
	}

	/**
	 * Remove many items.
	 * @param {List<string>} itemIds A List of objects representing the items to be removed.
	 */
	async removeMany(itemIds: List<string>): Promise<void>
	{
		if(!(itemIds instanceof List))
			throw new VariableTypeError(PATH, "WixDataRepository.removeMany()", itemIds, "List<string>.");

		await WixData.bulkRemove(this.collectionName, itemIds.toArray(), this._options);
	}

	private set wixDataRepository(wixDataRepository)
	{
		this._wixDataRepository = wixDataRepository;
	}

	private set name(name: string)
	{
		this._name = name;
	}

	private set associations(associations: KVMap<string, KVMap<string,WixDataModel>>)
	{
		this._associations = associations;
	}

	private get name(): string
	{
		return this._name;
	}

	private get associations(): KVMap<string,KVMap<string,WixDataModel>>
	{
		return this._associations;
	}

	private get wixDataRepository()
	{
		return this._wixDataRepository;
	}
}

export default WixDataModel;