const PATH = "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersFrontendAuthenticationService.js";

import WixUsersFrontend from "wix-users"

import WixUsersAuthenticationService from "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersAuthenticationService.js";


class WixUsersFrontendAuthenticationService extends WixUsersAuthenticationService
{
	constructor()
	{
		super(WixUsersFrontend);

		this._initSessionId();
	}

	_initSessionId()
	{
		if(!this._wixUsersModule.currentUser.loggedIn)
			this._sessionId = this._wixUsersModule.currentUser.id;
		else
			this._sessionId = "";
	}

	/**
	 * @override
	 * @inheritDoc
	 */
	isCurrentUsersId(id)
	{
		return this._wixUsersModule.currentUser.id === id || this._sessionId === id;
	}
}

export default WixUsersFrontendAuthenticationService;