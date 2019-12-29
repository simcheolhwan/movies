type Media = Movie | Tv

interface Movie extends Meta {
  tmdb: MovieTMDB
}

interface Tv extends Meta {
  tmdb: TvTMDB
}

interface Meta {
  watched_at: number
  genre: string
  ratings: Ratings
}

interface Ratings {
  grade?: -1 | 0 | 1
  best?: boolean
  watchlist?: boolean
  forgotten?: boolean
}
