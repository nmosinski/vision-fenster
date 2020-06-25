const PATH = "public/src/main/feature/shoppingCart/infrastructure/authenticationService/WixUsers/WixUsersAuthenticationService.js";

import IAuthenticationService from "public/src/main/feature/shoppingCart/model/IAuthenticationService.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

class WixUsersAuthenticationService extends IAuthenticationService()
{
	constructor(wixUsersModule)
	{
		super();
		if(JsTypes.isUnspecified(wixUsersModule))
			throw new VariableTypeError(PATH, "WixUsersAuthenticationService.constructor()", wixUsersModule, "wix-users");

		this._wixUsersModule = wixUsersModule;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	getCurrentUsersId()
	{
		return this._wixUsersModule.currentUser.id;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	isCurrentUsersId(id)
	{
		return this.getCurrentUsersId() === id;
	}

	get wixUsersModule()
	{
		return this._wixUsersModule;
	}
}

export default WixUsersAuthenticationService;