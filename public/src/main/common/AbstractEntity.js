const PATH = "public/src/main/common/AbstractEntity.js";

/**
 * @class
 * A class representing an abstract entity.
 */
export default class AbstractEntity
{
	/**
	 * Create AbstractEntity.
	 * @param {string} id - The id of this entity. 
	 */
	constructor(id)
	{
		this.id = id;
	}

	/**
	 * Get id.
	 * @return {string} The id of this entity.
	 */
	get id()
	{
		return this._id;
	}

	/**
	 * Set id.
	 * @param {string} id - The id of this entity.
	 */
	set id(id)
	{
		this._id = id;
	}
}