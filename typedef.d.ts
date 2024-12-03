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