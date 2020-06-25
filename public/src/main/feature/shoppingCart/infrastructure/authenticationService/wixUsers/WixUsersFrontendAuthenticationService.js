const PATH = "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersFrontendAuthenticationService.js";

import wixUsers from "wix-users"

import WixUsersAuthenticationService from "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersAuthenticationService.js";

var WixUsersFrontend = wixUsers;

class WixUsersFrontendAuthenticationService extends WixUsersAuthenticationService
{
	constructor()
	{
		super(WixUsersFrontend);
	}
}

export default WixUsersFrontendAuthenticationService;