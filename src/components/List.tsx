import React from 'react'
import { useFilter } from '../api/hooks'
import Media from './Media'
import styles from './List.module.scss'

const List = () => {
  const { filtered, count } = useFilter()

  return !count ? (
    <p className={styles.empty}>Empty</p>
  ) : (
    <section className={styles.container}>
      {filtered.map((group, index) => (
        <ul className={styles.list} key={index}>
          {group.map(media => {
            const { media_type, id } = media.tmdb
            return (
              <li className={styles.item} key={media_type + id}>
                <Media media={media} />
              </li>
            )
          })}
        </ul>
      ))}
    </section>
  )
}

export default List
