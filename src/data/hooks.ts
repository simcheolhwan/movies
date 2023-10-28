import { useReducer } from "react"
import { useParams, useLocation } from "react-router-dom"
import { useDatabase } from "../api/hooks"
import reducer, { initial } from "./reducer"
import select from "./select"

export const useURLParams = (): URLParams => {
  const { genre } = useParams<{ genre: string }>()
  const { search } = useLocation()
  const watched_at = parseWatchedAt(new URLSearchParams(search))
  return { genre, watched_at, isFront: !genre && !watched_at.length }
}

export const useFilterReducer = (): FilterContext => {
  /* state - url */
  const urlParams = useURLParams()

  /* state - reducer */
  const init = (initial: State) => ({ ...initial, best: urlParams.isFront })
  const [state, dispatch] = useReducer(reducer, initial, init)

  /* actions */
  const toggle = {
    best: () => dispatch({ best: !state.best }),
    shuffle: () => dispatch({ shuffle: !state.shuffle }),
    asc: () => dispatch({ asc: !state.asc }),
    groupWith: () => dispatch({ groupWith: state.groupWith ? undefined : initial.groupWith }),
  }

  const set = {
    title: (title: string) => dispatch({ title }),
  }

  /* results */
  const [collection] = useDatabase()
  const selected = { ...state, ...urlParams }
  const filtered = select(selected, collection)

  const count = filtered.reduce((acc, cur) => acc + cur.length, 0)

  return { selected, filtered, count, toggle, set }
}

/* helpers */
const parseWatchedAt = (p: URLSearchParams): number[] => {
  const SEP = "-"
  const watched_at = p.get("watched_at") ?? ""
  const [start, end] = watched_at?.split(SEP).map(getNumber)
  return start && end ? getBetween(start, end) : start ? [start] : []
}

const getNumber = (s: string) => (s ? Number(s) : NaN)
const getBetween = (start: number, end: number): number[] => {
  const re = (acc: number[], cur: number, end: number): number[] =>
    cur === end ? [...acc, cur] : re([...acc, cur], cur + 1, end)

  return re([], start, end)
}
