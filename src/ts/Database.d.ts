/** 데이터베이스에 저장하는 구조 */
type DB = Partial<MediaCollection & { indexes: Indexes }>

/** 리액트 앱에서 관리하는 구조 */
type Database = [MediaCollection, Indexes]

interface Indexes {
  watched_at: number[]
  genre: string[]
}

interface MediaCollection {
  movie: { [id: string]: Media }
  tv: { [id: string]: Media }
}
