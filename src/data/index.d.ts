interface FilterContext {
  selected: Selected
  filtered: Filtered
  count: number
  toggle: { [K in keyof State]?: () => React.Dispatch }
  set: { [K in keyof State]?: (p: State[K]) => React.Dispatch }
}

interface State {
  asc: boolean
  groupWith?: keyof Meta
  ratings?: Ratings
  title: string
}

interface Selected extends State {
  genre?: string
  watched_at?: number
}

type Filtered = Group[]
type Group = Media[]
