/**
 * Common data properties found in a world or session returned by SkyFrost.
 * 
 * @typedef {object} BaseWorldSessionInfo
 * @property  {string} title The plain text name of the world or session.
 * @property {string} name The rich text name of the world or session.
 * @property {string} description The description of the world or session.
*/

/**
 * The world information returned by SkyFrost.
 * 
 * @extends BaseWorldSessionInfo
 * @typedef {BaseWorldSessionInfo & WorldInfoInternalType} WorldInfo
*/

/**
 * The session information returned by SkyFrost.
 * 
 * @extends {BaseWorldSessionInfo}
 * @typedef {BaseWorldSessionInfo & SessionInfoInternalType} SessionInfo
*/

/**
 * @typedef {object} User
 * @property {string} username The username of the user.
*/

// Internal Types

/**
 * Used for extending the BaseWorldSessionInfo type with WorldInfo since intellisense does not support
 * extended or augmented types. Avoid using this outside of extending types.
 * 
 * @extends BaseWorldSessionInfo
 * @typedef {object} WorldInfoInternalType
 * @property {string} id The record id of the world.
 * @property {string} ownerName The name of the owner who owns the world.
 * @property {string} thumbnailUri The thumbnail image of the world as a URL.
 * @property {string[]} tags Additional tags that help define the world.
 * @property {string|Date} creationTime The date and time the world was first created on.
 * @property {string|Date} firstPublishTime The date and time the world was first published on.
 * @property {string|Date} lastModificationTime The date and tiem the world was last modified on. 
*/

/**
 * Used for extending the BaseWorldSessionInfo type with SessionInfo since intellisense does not support
 * extended or augmented types. Avoid using this outside of extending types.
 * 
 * @extends BaseWorldSessionInfo
 * @typedef {object} SessionInfoInternalType
 * @property {string} hostUsername The username of the host that is hosting the session.
 * @property {number} totalJoinedUsers The number of users that are present in the session.
 * @property {number} maxUsers The max number of users that can be in the session.
 * @property {string} appVersion The current FrooxEngine version that this session is running on.
 * @property {User[]} sessionUsers The users in the current session.
 * @property {string} thumbnailUrl The thumbnail image of the session as a URL.
 */