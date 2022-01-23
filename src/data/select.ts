import { helpers } from "../api/tmdb"
import shuffle from "./shuffle"

const select = (s: Selected, collection: MediaCollection): Filtered => {
  const { movie, tv } = collection
  const values: Media[] = [...Object.values(movie), ...Object.values(tv)]

  const filter = ({ watched_at, genre, best, tmdb }: Media) =>
    s.title
      ? matchTitle(tmdb, s.title)
      : (!s.watched_at.length || s.watched_at.includes(watched_at)) &&
        (!s.genre || (genre || "inbox") === s.genre) &&
        (!s.best || s.best === best)

  const sort = ({ tmdb: tmdbA }: Media, { tmdb: tmdbB }: Media) => {
    const a = helpers.getDate(tmdbA)
    const b = helpers.getDate(tmdbB)
    return (s.asc ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  }

  const results = values.filter(filter).sort(sort)

  return s.shuffle
    ? [shuffle(values)]
    : s.groupWith === "best"
    ? [true, false].map((d) => results.filter(({ best }) => d === !!best))
    : [results]
}

export default select

/* title */
const matchTitle = (tmdb: TMDB, s: string) => {
  const title = helpers.getTitle(tmdb)
  const original = helpers.getOriginal(tmdb).toLowerCase()
  const input = s.toLowerCase()
  return title.includes(input) || original.includes(input)
}
