const PATH = "public/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersBackendAuthenticationService.js";

import WixUsersBackend from "wix-users-backend"
import WixUsersAuthenticationService from "public/main/feature/shoppingCart/infrastructure/authenticationService/wixUsers/WixUsersAuthenticationService.js";

/**
 * @class
 * Class representing a wix users backend authentication service.
 */
class WixUsersBackendAuthenticationService extends WixUsersAuthenticationService
{
	/**
	 * Create WixUsersBackendAuthenticationService.
	 */
	constructor()
	{
		super(WixUsersBackend);
	}
}

export default WixUsersBackendAuthenticationService;