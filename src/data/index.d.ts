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
  best: boolean
  title: string
}

interface URLParams {
  genre?: string
  watched_at: number[]
  isFront: boolean
}

type Selected = State & URLParams
type Filtered = Group[]
type Group = Media[]
