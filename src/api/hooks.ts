import { useContext, createContext } from 'react'
import { pick, uniq } from 'ramda'
import { db } from './firebase'

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

/* Helper */
const createCtx = <A>() => {
  const ctx = createContext<A | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error('This must be inside a Provider with a value')
    return c
  }

  return [useCtx, ctx.Provider] as const
}

/* Context */
export const [useAuth, AuthProvider] = createCtx<Auth>()
export const [useDatabase, DatabaseProvider] = createCtx<Database>()

/* Hooks */
export const useActions = () => {
  const [authenticated] = useAuth()
  const [collection, indexes] = useDatabase()
  const app = db.ref('/app')

  const sort = (array: any[]) => uniq(array).sort()
  const append = (key: keyof Indexes, value: any) =>
    sort([...indexes[key], value])

  const updateMedia = (tmdb: TMDB, [key, updates]: [string, any]) =>
    authenticated &&
    app.child(`${tmdb.media_type}/${tmdb.id}/${key}`).set(updates)

  return {
    /* Media */
    addMedia: (data: TMDB, meta: Partial<Meta>) => {
      const tmdb = pick(Metadata, data)
      const watched_at = new Date().getFullYear()
      const updates = {
        [`${tmdb.media_type}/${tmdb.id}`]: { ...meta, tmdb, watched_at },
        [`indexes/watched_at`]: append('watched_at', watched_at)
      }

      authenticated && app.update(updates)
    },

    updateMedia,
    moveMedia: (tmdb: TMDB, genre: string) =>
      updateMedia(tmdb, ['genre', genre]),

    rateMedia: (tmdb: TMDB, ratings: Ratings) =>
      updateMedia(tmdb, ['ratings', ratings]),

    refreshMedia: (tmdb: TMDB, [updated, credits]: [TMDB, Credits]) => {
      const updates = {
        [`/app/${tmdb.media_type}/${tmdb.id}/tmdb`]: pick(Metadata, updated),
        [`/credits/${tmdb.media_type}/${tmdb.id}`]: credits
      }

      authenticated && db.ref().update(updates)
    },

    removeMedia: (tmdb: TMDB) =>
      authenticated && app.child(`${tmdb.media_type}/${tmdb.id}`).remove(),

    /* Genre */
    addGenre: (genre: string) =>
      authenticated && app.child(`indexes/genre`).set(append('genre', genre)),

    changeGenre: (genre: string, next: string) => {
      const getUpdates = (type: MediaType) =>
        Object.entries(collection[type])
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

      authenticated && app.update(updates)
    }
  }
}
