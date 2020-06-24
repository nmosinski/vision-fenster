const PATH = "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersBackendAuthenticationService.js";

import WixUsersBackend from "wix-users-backend"
import WixUsersAuthenticationService from "public/src/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersAuthenticationService.js";

class WixUsersBackendAuthenticationService extends WixUsersAuthenticationService
{
	constructor()
	{
		super(WixUsersBackend);
	}
}

export default WixUsersBackendAuthenticationService;