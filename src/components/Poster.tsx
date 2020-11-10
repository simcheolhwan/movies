import React from "react"
import classNames from "classnames"
import styles from "./Poster.module.scss"
import { helpers } from "../api/tmdb"

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  media: TMDB
  w: 342 | 92
  width?: number
}

const Poster = ({ media, w, className, ...props }: Props) => {
  const src = helpers.getPoster(media, w)
  const width = props.width || w / 2
  const height = width * 1.5

  const attrs = {
    src,
    width,
    height,
    loading: "lazy" as const,
    className: classNames(styles.poster, className),
  }

  return <img {...attrs} alt="" />
}

export default Poster
