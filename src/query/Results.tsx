import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { equals } from 'ramda'
import { useDatabase } from '../api/hooks'
import useIndexedCredits from './useIndexedCredits'
import styles from './Results.module.scss'
import Media from '../components/Media'

const Results = ({ q }: { q: Q }) => {
  const [media] = useDatabase()
  const { movie } = media
  const { isFetched, collection } = useIndexedCredits()

  const isCollectionValid = validateCollection(media, collection)
  const data = useMemo(() => query(collection, q), [collection, q])

  return !isFetched ? null : (
    <section className={styles.results}>
      {!isCollectionValid ? (
        <article>
          <p>브라우저에 저장된 데이터가 올바르지 않습니다.</p>
          <Link to="/collect">데이터 수집하기</Link>
        </article>
      ) : (
        data.map(({ id, name, filmography }) => {
          const count = [
            filmography.filter(id => movie[id].ratings?.best).length,
            filmography.length
          ]

          return (
            <article key={id}>
              <h1 className={styles.name}>
                {name} ({count.join('/')})
              </h1>

              <ul className={styles.filmography}>
                {filmography.map(id => (
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
const validateCollection = (
  media: MediaCollection,
  collection: CreditsCollection
) =>
  Object.keys(media).every(k =>
    equals(
      Object.keys(media[k as MediaType]),
      Object.keys(collection[k as MediaType])
    )
  )

/* query */
type Result = { id: string; name: string; filmography: string[] }
type Results = Result[]

const query = (collection: CreditsCollection, q: Q): Results => {
  const group = Object.entries(collection.movie).reduce(
    (acc: { [id: string]: Result }, [id, { crew }]) => {
      const getNext = (p: Crew) => {
        const { filmography = [] } = acc[p.id] || {}
        return { id: p.id, name: p.name, filmography: [...filmography, id] }
      }

      const p = crew.find(c => c[q[0]].toLowerCase() === q[1].toLowerCase())
      return Object.assign({}, acc, p && { [p.id]: getNext(p) })
    },
    {}
  )

  const filtered = Object.values(group).filter(
    ({ filmography }) => filmography.length > 2
  )

  const sorted = filtered.sort(({ filmography: a }, { filmography: b }) =>
    a.length === b.length ? 0 : a.length > b.length ? -1 : 1
  )

  return sorted
}
