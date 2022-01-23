import { Link, LinkProps } from "react-router-dom"
import { useDrop } from "react-dnd"
import classNames from "classnames"
import { useActions } from "../api/hooks"
import styles from "./GenreLink.module.scss"

interface Props extends Genre {
  className: string
  children: string
}

const GenreLink = ({ to, count, className, children: genre }: Props) => {
  const { changeGenre } = useActions()
  const [{ isOver }, drop] = useDrop({
    accept: "media",
    drop: () => ({ genre }),
    collect: (monitor) => ({ isOver: !!monitor.isOver() }),
  })

  const attrs: LinkProps = {
    to,
    innerRef: drop,
    className: classNames(className, isOver && styles.isOver),
    onContextMenu: (e) => {
      e.preventDefault()
      const next = (window.prompt(`장르 이름 변경: ${genre}`) || "").trim()
      next && changeGenre(genre, next)
    },
  }

  return (
    <Link {...attrs}>
      <span>{genre}</span>
      <small className={styles.small}>{count}</small>
    </Link>
  )
}

export default GenreLink
