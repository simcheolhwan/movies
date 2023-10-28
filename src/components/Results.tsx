import { helpers } from "../api/tmdb"
import { useDatabase } from "../api/hooks"
import Poster from "./Poster"
import styles from "./Results.module.scss"

const Item = ({ onClick, ...item }: { onClick: () => void } & TMDB) => {
  const { id, media_type } = item
  const title = helpers.getTitle(item)
  const link = helpers.getLink(item)
  const date = helpers.getYear(item)
  const type = helpers.getType(item)

  const [collection] = useDatabase()
  const added = collection[media_type][id]
  const { genre, watched_at } = added || {}

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    onClick()
  }

  return (
    <li className={styles.item}>
      <a href={link} onClick={handleClick} className={styles.movie}>
        <Poster media={item} w={92} className={styles.poster} />
        <main>
          <h1>{title}</h1>
          <p className={styles.meta}>
            {date}
            {type && ` (${type})`}
          </p>
        </main>
      </a>

      <small className={styles.already}>{added && `이미 추가함: ${genre} (${watched_at})`}</small>
    </li>
  )
}

interface Props {
  results: TMDB[]
  onAdd: (index: number) => void
}

const Results = ({ results, onAdd }: Props) => (
  <section className={styles.results}>
    <h1 className={styles.title}>검색 결과</h1>
    <ul className={styles.list}>
      {results.map((item, index) => (
        <Item {...item} onClick={() => onAdd(index)} key={item.id} />
      ))}
    </ul>
  </section>
)

export default Results
