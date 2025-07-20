type HandleType = 'world' | 'worldList' | 'session' | 'sessionList'

type RecordApiSearchSortField = 'CreationDate' | 'LastUpdateDate' | 'FirstPublishTime'

type RecordApiSearchSortDirection = 'Ascending' | 'Descending'

type RecordApiSearchParameters = {
  recordType: string
  count: number
  offset: number
  private: boolean
  requiredTags: string[]
  optionalTags: string[]
  excludedTags: string[]
  sortBy: RecordApiSearchSortField
  sortDirection: RecordApiSearchSortDirection
}

type WorldSearchRequestParameters = import('express-serve-static-core').ParamsDictionary | {
  term?: string
  pageIndex: number
}

type WorldSearchResult = {
  hasMoreResults: boolean
  records: WorldInfo[]
}

/**
 * A data model that contains information of the Resonite user.
 */
type User = {
  /**The username of the user. */
  username: string
}

/**
 * Common data properties found in a world or session returned by the Resonite API.
 */
type BaseWorldSessionInfo = {
  /** The plain text name of the world or session */
  title: string 
  /** The rich text name of the world or session. */
  name: string
  /** The description of the world or session. */
  description: string
}

/**
 * The world information returned by the Resonite API.
 */
type WorldInfo = BaseWorldSessionInfo | {
  /** id The record id of the world. */
  id: string
  /** The name of the owner who owns the world. */
  ownerName: string
  /** The id of the owner who owns the world. */
  ownerId: string
  /** The thumbnail image of the world as a URL. */
  thumbnailUri: string
  /** Additional tags that help define the world. */
  tags: string[]
  /** The date and time the world was first created on. */
  creationTime: string | Date
  /** The url of the world for go.resonite.com. */
  goUri: string
  /** The date and time the world was first published on. */
  firstPublishTime: string | Date
  /** The date and tiem the world was last modified on. */
  lastModificationTime: string | Date
}

/**
 * The session information returned by the Resonite API.
 */
type SessionInfo = BaseWorldSessionInfo | {
  /** The username of the host that is hosting the session. */
  hostUsername: string
  /** The number of users that are present in the session. */
  totalJoinedUsers: number
  /** The max number of users that can be in the session. */
  maxUsers: number
  /** The current FrooxEngine version that this session is running on. */
  appVersion: string
  /** The users in the current session. */
  sessionUsers: User[]
  /** The thumbnail image of the session as a URL. */
  thumbnailUrl: string
}

/**
 * Configuration data used to examine a world and determine if it is an MMC entry.
 */
type MmcConfig = {
  /** The year that the MMC event was hosted in. */
  year: number
  /** The identifying competition tag for the MMC event. */
  competitionTag: string
  /** An additional identifying competition tag for the MMC event. */
  competitionOtherTag?: string
  /** The official start date of the competition. This is usually the kickoff date. */
  startDate: Date
  /** The official end date of the competition. This is usually the awards ceremony date. */
  endDate: Date
  /** The relative URL path of the Wiki page for the MMC event. */
  wikiPath: string
  /** The list of categories that an entry can be tagged with. */
  categories: MmcCategory[]
}

/**
 * MMC category data that contains either a friendly name of the category or
 * a map of additional `MmcCategory` objects (i.e., subcategories).
 */
type MmcCategory = {
  /** The friendly name of the category. */
  title: string
  /** The parent category of this category. If `null`, then this  */
  parent: MmcCategory
  /** The tags that are required for the category.*/
  requiredTags: string[]
  /** A unique key to help distinguish the category from others. */
  tagKey: string
}
