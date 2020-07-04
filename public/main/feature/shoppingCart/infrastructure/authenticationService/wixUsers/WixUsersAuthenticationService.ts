const PATH = "public/src/main/feature/shoppingCart/infrastructure/authenticationService/WixUsers/WixUsersAuthenticationService.js";

import IAuthenticationService from "public/src/main/feature/shoppingCart/model/IAuthenticationService.js"
import JsTypes from "public/src/main/common/util/jsTypes/JsTypes.js"
import VariableTypeError from "public/src/main/common/util/error/VariableTypeError.js"

/**
 * @class
 * A class representing a wix users authentiaction service.
 */
class WixUsersAuthenticationService implements IAuthenticationService
{
	protected _wixUsersModule: any;
	/**
	 * @param {any} wixUsersModule
	 */
	constructor(wixUsersModule: any)
	{
		if(JsTypes.isUnspecified(wixUsersModule))
			throw new VariableTypeError(PATH, "WixUsersAuthenticationService.constructor()", wixUsersModule, "wix-users");

		this._wixUsersModule = wixUsersModule;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	getCurrentUsersId(): string
	{
		return this._wixUsersModule.currentUser.id;
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	isCurrentUsersId(id: string): boolean
	{
		return this.getCurrentUsersId() === id;
	}

	/**
	 * @returns {any} The WixUsersModule
	 */
	get wixUsersModule(): any
	{
		return this._wixUsersModule;
	}
}

export default WixUsersAuthenticationService;