/** 데이터베이스에 저장하는 구조 */
type DB = Partial<MediaCollection & { indexes: Indexes }>

/** 리액트 앱에서 관리하는 구조 */
type Database = [MediaCollection, Indexes]

interface MediaCollection {
  movie: MovieDB
  tv: TvDB
}

interface MovieDB {
  [id: string]: Movie
}
interface TvDB {
  [id: string]: Tv
}

type MediaDB = MovieDB | TvDB

interface Indexes {
  watched_at: number[]
  genre: string[]
}
