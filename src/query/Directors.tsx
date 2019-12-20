import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { equals } from 'ramda'
import classNames from 'classnames'
import { useDatabase } from '../api/hooks'
import useIndexedCredits from './useIndexedCredits'
import Poster from '../components/Poster'
import styles from './Directors.module.scss'

const Directors = () => {const [media] = useDatabase()
  const { movie } = media
  const { collection } = useIndexedCredits()

  const isCollectionValid = validateCollection(media, collection)
  const data = useMemo(() => query(collection), [collection])

  return  <section className={styles.results}>
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

                <main className={styles.filmography}>
                  {filmography.map(id => (
                    <article style={{ width: 342 / 2 }} key={id}>
                      <Poster media={movie[id].tmdb} w={342} />
                      <h1
                        className={classNames(
                          styles.title,
                          movie[id].ratings?.best && styles.best,
                          movie[id].ratings?.grade === -1 && styles.bad
                        )}
                      >
                        {movie[id].tmdb.title}
                      </h1>
                    </article>
                  ))}
                </main>
              </article>
            )
          })
        )}
      </section>
}

export default Directors

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
type Q = [keyof Omit<Crew, 'id'>, string]
type Result = { id: string; name: string; filmography: string[] }
type Results = Result[]

const query = (
  collection: CreditsCollection,
  q: Q = ['job', 'director']
): Results => {
  const group = Object.entries(collection.movie).reduce(
    (acc: { [id: string]: Result }, [id, { crew }]) => {
      const getNext = (p: Crew) => {
        const { filmography = [] } = acc[p.id] || {}
        return { id: p.id, name: p.name, filmography: [...filmography, id] }
      }

      const p = crew.find(c => c[q[0]].toLowerCase() === q[1])
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
