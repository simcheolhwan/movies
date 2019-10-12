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
  const { authenticated, indexes, movies } = useApp()
  const sort = array => uniq(array).sort()
  const append = (key, value) => sort([...indexes[key], value])

  return {
    /* Movies */
    addMovie: (movie, meta) => {
      const tmdb = pick(Metadata, movie)
      const watched_at = new Date().getFullYear()
      const updates = {
        [`movies/${tmdb.id}`]: { ...meta, tmdb, watched_at },
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
      authenticated && db.ref(`indexes/genre`).set(append('genre', genre)),

    changeGenre: (genre, next) => {
      const movieUpdates = Object.entries(movies)
        .filter(([id, movie]) => movie.genre === genre)
        .reduce(
          (acc, [id, movie]) => ({
            ...acc,
            [`movies/${id}`]: { ...movie, genre: next }
          }),
          {}
        )

      const updates = {
        ...movieUpdates,
        'indexes/genre': sort(indexes.genre.map(g => (g === genre ? next : g)))
      }

      authenticated && db.ref().update(updates)
    }
  }
}
