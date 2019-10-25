interface Media extends Meta {
  tmdb: TMDB
}

interface Meta {
  watched_at: number
  genre: string
  ratings?: Ratings
}

interface Ratings {
  grade?: -1 | 0 | 1
  best?: boolean
  watchlist?: boolean
  forgotten?: boolean
}
