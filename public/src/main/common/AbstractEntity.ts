const PATH = "public/src/main/common/AbstractEntity.js";

/**
 * @class
 * A class representing an abstract entity.
 */
class AbstractEntity
{
	protected _id: string;
	/**
	 * Create AbstractEntity.
	 * @param {string} [id=null] - The id of this entity. 
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
		this._id = id;
	}
}

export default AbstractEntity;