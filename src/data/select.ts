import { helpers } from '../api/tmdb'

export default (selected: Selected, collection: MediaCollection): Filtered => {
  const { movie, tv } = collection
  const values: Media[] = [...Object.values(movie), ...Object.values(tv)]

  const filter = ({ watched_at, genre, best, tmdb }: Media) =>
    selected.title
      ? matchTitle(tmdb, selected.title)
      : (!selected.watched_at || watched_at === selected.watched_at) &&
        (!selected.genre || (genre || 'inbox') === selected.genre) &&
        (!selected.best || selected.best === best)

  const sort = ({ tmdb: tmdbA }: Media, { tmdb: tmdbB }: Media) => {
    const a = helpers.getDate(tmdbA)
    const b = helpers.getDate(tmdbB)
    return (selected.asc ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  }

  const results = values.filter(filter).sort(sort)

  return selected.groupWith === 'best'
    ? [true, false].map(d => results.filter(({ best }) => d === !!best))
    : [results]
}

/* title */
const matchTitle = (tmdb: TMDB, selected: string) => {
  const title = helpers.getTitle(tmdb)
  const original = helpers.getOriginal(tmdb).toLowerCase()
  const input = selected.toLowerCase()
  return title.includes(input) || original.includes(input)
}
