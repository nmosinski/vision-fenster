const PATH = "public/src/main/common/AbstractEntity.js";

export default class AbstractEntity
{
	constructor(id)
	{
		this.id = id;
	}

	get id()
	{
		return this._id;
	}

	set id(id)
	{
		this._id = id;
	}
}