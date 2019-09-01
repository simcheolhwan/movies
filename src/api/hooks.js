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
  const { indexes } = useApp()
  const append = (key, value) => uniq([...indexes[key], value]).sort()

  return {
    /* Movies */
    addMovie: movie => {
      const tmdb = pick(Metadata, movie)
      const watched_at = new Date().getFullYear()
      db.ref(`movies/${tmdb.id}`).set({ tmdb, watched_at })
      db.ref(`indexes/watched_at`).set(append('watched_at', watched_at))
    },

    moveMovie: (id, genre) => {
      db.ref(`movies/${id}/genre`).set(genre)
    },

    rateMovie: (id, ratings) => {
      db.ref(`movies/${id}/ratings`).set(ratings)
    },

    /* Genre */
    addGenre: genre => {
      db.ref(`indexes/genre`).set(append('genre', genre))
    }
  }
}
