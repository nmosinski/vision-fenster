const PATH = "public/main/common/AbstractEntity.js";
//@ts-ignore
import { v4 as UUID } from 'uuid';
import JsTypes from './util/jsTypes/JsTypes';

/**
 * @class
 * A class representing an abstract entity.
 */
class AbstractEntity
{
	protected _id: string;
	/**
	 * Create AbstractEntity.
	 * @param {string} [id=null] - The id of this entity. Will be generated randomly if not given.
	 */
	constructor(id: string=null)
	{
		this.id = id;
	}

	/**
	 * Get id.
	 * @return {string} The id of this entity.
	 */
	get id(): string
	{
		return this._id;
	}

	/**
	 * Set id.
	 * @param {string} id - The id of this entity.
	 */
	set id(id: string)
	{
		if(JsTypes.isUnspecified(id))
			this._id = UUID();
		else
			this._id = id;
	}
}

export default AbstractEntity;