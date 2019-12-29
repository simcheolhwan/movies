import { useReducer, useMemo } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { useDatabase } from '../api/hooks'
import reducer, { initial } from './reducer'
import select from './select'

export const useFilterReducer = (): FilterContext => {
  /* state - url */
  const { genre } = useParams()
  const { search } = useLocation()
  const watched_at =
    Number(new URLSearchParams(search).get('watched_at')) || undefined

  /* state - reducer */
  const [state, dispatch] = useReducer(reducer, initial)

  /* actions */
  const toggle = {
    asc: () => dispatch({ asc: !state.asc }),
    groupWith: () =>
      dispatch({ groupWith: state.groupWith ? undefined : initial.groupWith })
  }

  const set = {
    ratings: (ratings?: Ratings) => dispatch({ ratings }),
    title: (title: string) => dispatch({ title })
  }

  /* results */
  const [collection] = useDatabase()
  const selected = { ...state, genre, watched_at }
  const filtered = useMemo(() => select(selected, collection), [
    selected,
    collection
  ])

  const count = filtered.reduce((acc, cur) => acc + cur.length, 0)

  return { selected, filtered, count, toggle, set }
}