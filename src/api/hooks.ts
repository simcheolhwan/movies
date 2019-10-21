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
  'release_date',
  'first_air_date'
]

export const useApp = () => {
  const app = useContext(AppContext)

  if (!app) {
    throw new Error('useApp must be inside a Provider with a value')
  }

  return app
}

export const useActions = () => {
  const { authenticated, indexes, ...media } = useApp()
  const sort = (array: any[]) => uniq(array).sort()
  const append = (key: keyof Indexes, value: any) =>
    sort([...indexes[key], value])

  const updateMedia = (tmdb: TMDB, [key, updates]: [string, any]) =>
    authenticated && db.ref(`${tmdb.media_type}/${tmdb.id}/${key}`).set(updates)

  return {
    /* Media */
    addMedia: (data: TMDB, meta: Partial<Meta>) => {
      const tmdb = pick(Metadata, data)
      const watched_at = new Date().getFullYear()
      const updates = {
        [`${tmdb.media_type}/${tmdb.id}`]: { ...meta, tmdb, watched_at },
        [`indexes/watched_at`]: append('watched_at', watched_at)
      }

      authenticated && db.ref().update(updates)
    },

    updateMedia,
    moveMedia: (tmdb: TMDB, genre: string) =>
      updateMedia(tmdb, ['genre', genre]),

    rateMedia: (tmdb: TMDB, ratings: Ratings) =>
      updateMedia(tmdb, ['ratings', ratings]),

    refreshMedia: (tmdb: TMDB, data: TMDB) =>
      updateMedia(tmdb, ['tmdb', pick(Metadata, data)]),

    removeMedia: (tmdb: TMDB) =>
      authenticated && db.ref(`${tmdb.media_type}/${tmdb.id}`).remove(),

    /* Genre */
    addGenre: (genre: string) =>
      authenticated && db.ref(`indexes/genre`).set(append('genre', genre)),

    changeGenre: (genre: string, next: string) => {
      const getUpdates = (type: MediaType) =>
        Object.entries(media[type])
          .filter(([, media]) => media.genre === genre)
          .reduce(
            (acc, [id, media]) => ({
              ...acc,
              [`${type}/${id}`]: { ...media, genre: next }
            }),
            {}
          )

      const updates = {
        ...getUpdates('movie'),
        ...getUpdates('tv'),
        'indexes/genre': sort(indexes.genre.map(g => (g === genre ? next : g)))
      }

      authenticated && db.ref().update(updates)
    }
  }
}
