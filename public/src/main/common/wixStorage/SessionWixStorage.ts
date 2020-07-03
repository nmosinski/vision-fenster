const PATH = "public/src/main/common/wixStorage/SessionWixStorage.js";

import AbstractWixStorage from "public/src/main/common/wixStorage/AbstractWixStorage.js"
import {session} from "wix-storage"

/**
 * @class
 * A wrapper class for wix-storage, session.
 */
class SessionWixStorage extends AbstractWixStorage
{
	/**
	 * Create SessionWixStorage.
	 */
	constructor()
	{
		super(session);
	}
}

export default SessionWixStorage;