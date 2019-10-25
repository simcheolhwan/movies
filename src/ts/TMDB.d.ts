type TMDB = MovieTMDB | TvTMDB
type MediaType = 'movie' | 'tv'

interface DefaultTMDB {
  id: number
  media_type: MediaType
  poster_path: 'string'
  vote_count: number
}

interface MovieTMDB extends DefaultTMDB {
  title: string
  release_date: string
}

interface TvTMDB extends DefaultTMDB {
  name: string
  first_air_date: string
}
