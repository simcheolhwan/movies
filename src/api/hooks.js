import { useContext } from 'react'
import { pick, uniq } from 'ramda'
import { db } from './firebase'
import { AppContext } from '../components/App'

/* Constants */
const Metadata = [
  'id',
  'original_language',
  'original_title',
  'poster_path',
  'release_date',
  'title'
]

export const useApp = () => useContext(AppContext)
export const useActions = () => {
  const { indexes } = useApp()

  /* Movies */
  const addMovie = movie => {
    const tmdb = pick(Metadata, movie)
    const watched_at = new Date().getFullYear()
    db.ref(`movies/${tmdb.id}`).set({ tmdb, watched_at })
    db.ref('indexes/watched_at').set(
      uniq([...indexes.watched_at, watched_at]).sort()
    )
  }

  return { addMovie }
}
