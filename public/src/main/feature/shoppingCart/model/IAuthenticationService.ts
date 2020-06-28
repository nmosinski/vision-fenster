/**
 * @interface
 * Interface representing an authentication service.
 */
interface IAuthenticationService
{
	/**
	 * Get current users id.
	 * @return {string} - The id of the current user.
	 */
	getCurrentUsersId(): string

	/**
	 * Check if the given id is the one from the current user.
	 * @param  {string}  id - The id of the user to be checked for if its the current one.
	 * @return {boolean} True if the id represents the current user, else false.
	 */
	isCurrentUsersId(id: string): boolean;
}

export default IAuthenticationService;