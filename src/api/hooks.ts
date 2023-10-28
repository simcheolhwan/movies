import { useContext, createContext } from "react"
import { pick, uniq, omit } from "ramda"
import { ref, remove, set, update } from "firebase/database"
import { db } from "./firebase"

/* Constants */
const Metadata = [
  "media_type",
  "id",
  "title",
  "name",
  "original_title",
  "original_name",
  "original_language",
  "poster_path",
  "release_date",
  "first_air_date",
  "production_companies",
]

/* Helper */
const createCtx = <A>() => {
  const ctx = createContext<A | undefined>(undefined)

  const useCtx = () => {
    const c = useContext(ctx)
    if (!c) throw new Error("This must be inside a Provider with a value")
    return c
  }

  return [useCtx, ctx.Provider] as const
}

/* Context */
export const [useApp, AppProvider] = createCtx<App>()
export const [useAuth, AuthProvider] = createCtx<Auth>()
export const [useDatabase, DatabaseProvider] = createCtx<Database>()
export const [useFilter, FilterProvider] = createCtx<FilterContext>()

/* Hooks */
export const useActions = () => {
  const [authenticated] = useAuth()
  const [collection, indexes] = useDatabase()
  const app = ref(db)

  const sort = (array: any[]) => uniq(array).sort()
  const append = (key: keyof Indexes, value: any) =>
    sort([...indexes[key], value])

  const updateMedia = (tmdb: TMDB, [key, updates]: [string, any]) =>
    authenticated &&
    set(ref(db, `${tmdb.media_type}/${tmdb.id}/${key}`), updates)

  return {
    /* Media */
    addMedia: (data: TMDB, meta: Partial<Meta>) => {
      const tmdb = pick(Metadata, data)
      const watched_at = new Date().getFullYear()
      const updates = {
        [`${tmdb.media_type}/${tmdb.id}`]: { ...meta, tmdb, watched_at },
        [`indexes/watched_at`]: append("watched_at", watched_at),
      }

      authenticated && update(app, updates)
    },

    updateMedia,
    rateMedia: (tmdb: TMDB, best: Best) => updateMedia(tmdb, ["best", best]),

    moveMedia: (tmdb: TMDB, genre: string) =>
      updateMedia(tmdb, ["genre", genre]),

    refreshMedia: (tmdb: TMDB, updated: TMDB) => {
      const next = pick(Metadata, omit(["title", "name"], updated))
      updateMedia(tmdb, ["tmdb", { ...tmdb, ...next }])
    },

    removeMedia: (tmdb: TMDB) =>
      authenticated && remove(ref(db, `${tmdb.media_type}/${tmdb.id}`)),

    /* Genre */
    addGenre: (genre: string) =>
      authenticated && set(ref(db, `indexes/genre`), append("genre", genre)),

    changeGenre: (genre: string, next: string) => {
      const getUpdates = (type: MediaType) =>
        Object.entries(collection[type])
          .filter(([, media]) => media.genre === genre)
          .reduce(
            (acc, [id, media]) => ({
              ...acc,
              [`${type}/${id}`]: { ...media, genre: next },
            }),
            {},
          )

      const updates = {
        ...getUpdates("movie"),
        ...getUpdates("tv"),
        "indexes/genre": sort(
          indexes.genre.map((g) => (g === genre ? next : g)),
        ),
      }

      authenticated && update(ref(db), updates)
    },
  }
}
