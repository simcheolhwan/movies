import React from "react"
import { useApp, useFilter } from "../api/hooks"
import Media from "./Media"
import styles from "./List.module.scss"

const List = () => {
  const { hydrated } = useApp()
  const { selected, filtered, count } = useFilter()
  const isLoading = !selected.title && !count && !hydrated

  return isLoading ? (
    <div className={styles.state}>Loading...</div>
  ) : !count ? (
    <p className={styles.state}>Empty</p>
  ) : (
    <section className={styles.container}>
      {filtered.map((group, index) => (
        <ul className={styles.list} key={index}>
          {group.map((media) => {
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
