interface App extends DB {
  authenticated: boolean
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
}

interface DB {
  indexes: Indexes
  movie: { [id: string]: Media }
  tv: { [id: string]: Media }
}

interface Media extends Meta {
  tmdb: TMDB
}

interface Meta {
  watched_at: number
  genre: string
  ratings: Ratings
}

type TMDB = MovieTMDB | TvTMDB

interface DefaultTMDB {
  id: number
  media_type: MediaType
  poster_path: 'string'
}

type MediaType = 'movie' | 'tv'

interface MovieTMDB extends DefaultTMDB {
  title: string
  release_date: string
}

interface TvTMDB extends DefaultTMDB {
  name: string
  first_air_date: string
}

interface Ratings {
  grade?: -1 | 0 | 1
  best?: boolean
  watchlist?: boolean
  forgotten?: boolean
}

interface Indexes {
  watched_at: number[]
  genre: string[]
}
