type TMDB = MovieTMDB | TvTMDB
type MediaType = "movie" | "tv"

interface DefaultTMDB {
  id: number
  media_type: MediaType
  poster_path: string
  vote_count: number
  original_language: string
  production_companies?: { name: string }[]
}

interface MovieTMDB extends DefaultTMDB {
  title: string
  original_title: string
  release_date: string
}

interface TvTMDB extends DefaultTMDB {
  name: string
  original_name: string
  first_air_date: string
}
