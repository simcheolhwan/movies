import React from "react"
import { Link } from "react-router-dom"
import classNames from "classnames"
import { PlusIcon as Plus } from "@primer/octicons-react"
import { useAuth, useActions } from "../api/hooks"
import useGenres from "../hooks/useGenres"
import GenreLink from "./GenreLink"
import styles from "./Genres.module.scss"

const Genres = () => {
  const genres = useGenres()
  const [authenticated] = useAuth()
  const actions = useActions()

  const addGenre = () => {
    const input = (prompt() || "").trim()
    input && actions.addGenre(input)
  }

  return (
    <ul className={styles.list}>
      {genres.map((genre) => {
        const { to, icon, label, isSelected, isMenu } = genre
        const className = classNames(styles.link, isSelected && styles.active)
        const props = { to, className }

        return (
          <li className={styles.item} key={label}>
            {isMenu ? (
              <Link {...props}>
                <span>
                  {icon} {label}
                </span>
              </Link>
            ) : (
              <GenreLink {...genre} {...props}>
                {label}
              </GenreLink>
            )}
          </li>
        )
      })}

      {authenticated && (
        <button onClick={addGenre} className={styles.link}>
          <span>
            <Plus /> 새 장르 추가
          </span>
        </button>
      )}
    </ul>
  )
}

export default Genres
