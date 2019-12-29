import { helpers } from '../api/tmdb'

export default (selected: Selected, collection: MediaCollection): Filtered => {
  const { movie, tv } = collection
  const values: Media[] = [...Object.values(movie), ...Object.values(tv)]

  const filter = ({ watched_at, genre, ratings, tmdb }: Media) =>
    selected.title
      ? matchTitle(tmdb, selected.title)
      : (!selected.watched_at || watched_at === selected.watched_at) &&
        (!selected.genre || (genre || 'inbox') === selected.genre) &&
        (!selected.ratings || matchRatings(ratings, selected.ratings))

  const sort = ({ tmdb: tmdbA }: Media, { tmdb: tmdbB }: Media) => {
    const a = helpers.getDate(tmdbA)
    const b = helpers.getDate(tmdbB)
    return (selected.asc ? 1 : -1) * (a > b ? 1 : a < b ? -1 : 0)
  }

  const results = values.filter(filter).sort(sort)

  return selected.groupWith === 'ratings'
    ? RatingsOrder.map(f => results.filter(({ ratings = {} }) => f(ratings)))
    : [results]
}

/* title */
const matchTitle = (tmdb: TMDB, selected: string) => {
  const title = helpers.getTitle(tmdb)
  const original = helpers.getOriginal(tmdb).toLowerCase()
  const input = selected.toLowerCase()
  return title.includes(input) || original.includes(input)
}

/* ratings */
const matchRatings = (r: Ratings = {}, selected: Ratings) =>
  Object.entries(r).some(
    ([k, v]) => !!selected && selected[k as keyof Ratings] === v
  )

const RatingsOrder: ((p: Ratings) => boolean)[] = [
  /* No ratings */ ratings => !Object.values(ratings).length,
  /* Best */ ({ best }) => !!best,
  /* Good */ ({ grade }) => grade === 1,
  /* Watched */ ({ grade }) => grade === 0,
  /* Forgotten */ ({ forgotten }) => !!forgotten,
  /* Worst */ ({ grade }) => grade === -1
]
