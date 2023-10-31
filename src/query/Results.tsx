import { useMemo } from "react"
import { Link } from "react-router-dom"
import { equals } from "ramda"
import { helpers } from "../api/tmdb"
import { useDatabase } from "../api/hooks"
import useIndexedCredits from "./useIndexedCredits"
import styles from "./Results.module.scss"
import Media from "../components/Media"

const Results = ({ crew, cast }: Q) => {
  const [media] = useDatabase()
  const { movie } = media
  const { isFetched, collection } = useIndexedCredits()

  const isCollectionValid = validateCollection(media, collection)
  const withoutMarvel = useMemo(() => {
    const values = Object.values<Credits>(collection.movie)
    return values.filter(
      ({ id }) =>
        !helpers.getProductionCompany(movie[id].tmdb, "Marvel") && !helpers.getCollection(movie[id].tmdb, "X-Men"),
    )
  }, [collection, movie])

  const data = useMemo(() => {
    return query(withoutMarvel, { crew, cast })
  }, [withoutMarvel, crew, cast])

  return !isFetched ? null : (
    <section className={styles.results}>
      {!isCollectionValid ? (
        <article>
          <p>브라우저에 저장된 데이터가 올바르지 않습니다.</p>
          <Link to="/collect">데이터 수집하기</Link>
        </article>
      ) : (
        data.map(({ id, name, filmography, popularity }) => {
          const count = [filmography.filter((id) => movie[id].best).length, filmography.length]

          return (
            <article key={id}>
              <h1 className={styles.name}>
                <a href={helpers.getPersonLink(id)} target="_blank" rel="noopener noreferrer">
                  {name} ({count.join("/")}) <small>{popularity}</small>
                </a>
              </h1>

              <ul className={styles.filmography}>
                {filmography
                  .sort((idA, idB) => {
                    const a = helpers.getDate(movie[idA].tmdb)
                    const b = helpers.getDate(movie[idB].tmdb)
                    return a === b ? 0 : a > b ? 1 : -1
                  })
                  .map((id) => (
                    <li className={styles.item} key={id}>
                      <Media media={movie[id]} />
                    </li>
                  ))}
              </ul>
            </article>
          )
        })
      )}
    </section>
  )
}

export default Results

/* validate */
const validateCollection = (media: MediaCollection, collection: CreditsCollection) =>
  Object.keys(media).every((k) => equals(Object.keys(media[k as MediaType]), Object.keys(collection[k as MediaType])))

/* query */
type Result = { id: number; name: string; filmography: number[]; popularity: number }
type People = Record<string, Result>

const query = (values: Credits[], q: Q): Result[] => {
  const group = values.reduce((acc: People, { id: movieId, crew, cast }) => {
    const getNext = ({ id, name, popularity }: Person): People => {
      const { filmography = [] } = acc[id] || {}
      const result = { id, name, filmography: [...filmography, movieId], popularity }
      return { [String(id)]: result }
    }

    const people = () => {
      return cast.reduce((acc, person) => Object.assign({}, acc, getNext(person)), {})
    }

    const person = () => {
      const person = crew.find((c) => String(c[q.crew[0]]).toLowerCase() === q.crew[1].toLowerCase())
      return person ? getNext(person) : {}
    }

    return Object.assign({}, acc, q.cast ? people() : person())
  }, {})

  const filtered = Object.values(group).filter(({ filmography }) => filmography.length > (q.cast ? 9 : 2))

  const sorted = filtered.sort((a, b) => {
    const getScore = ({ popularity, filmography }: Result) => {
      const count = filmography.length
      return popularity * count
    }

    const scoreA = getScore(a)
    const scoreB = getScore(b)

    return scoreA === scoreB ? 0 : scoreA > scoreB ? -1 : 1
  })

  return sorted
}
