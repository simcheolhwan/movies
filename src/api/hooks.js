import { useContext } from 'react'
import { pick, uniq } from 'ramda'
import { db } from './firebase'
import { AppContext } from '../components/App'

/* Constants */
const Metadata = [
  'media_type',
  'id',
  'title',
  'name',
  'original_title',
  'original_name',
  'original_language',
  'poster_path',
  'release_date'
]

export const useApp = () => useContext(AppContext)
export const useActions = () => {
  const { authenticated, indexes } = useApp()
  const append = (key, value) => uniq([...indexes[key], value]).sort()

  return {
    /* Movies */
    addMovie: movie => {
      const tmdb = pick(Metadata, movie)
      const watched_at = new Date().getFullYear()
      const updates = {
        [`movies/${tmdb.id}`]: { tmdb, watched_at },
        [`indexes/watched_at`]: append('watched_at', watched_at)
      }

      authenticated && db.ref().update(updates)
    },

    moveMovie: (id, genre) =>
      authenticated && db.ref(`movies/${id}/genre`).set(genre),

    rateMovie: (id, ratings) =>
      authenticated && db.ref(`movies/${id}/ratings`).set(ratings),

    removeMovie: id => authenticated && db.ref(`movies/${id}`).remove(),

    /* Genre */
    addGenre: genre =>
      authenticated && db.ref(`indexes/genre`).set(append('genre', genre))
  }
}
