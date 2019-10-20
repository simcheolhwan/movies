import React from 'react'
import classNames from 'classnames'
import styles from './Poster.module.scss'
import { helpers } from '../api/tmdb'

interface Props extends React.HTMLAttributes<HTMLImageElement> {
  media: TMDB
  w: number
  width?: number
}

const Poster: React.FC<Props> = ({ media, w, className, ...props }) => {
  const src = helpers.getPoster(media, w)
  const width = props.width || w / 2
  const height = width * 1.5

  const attrs = {
    src,
    width,
    height,
    loading: 'lazy',
    className: classNames(styles.poster, className)
  }

  return <img {...attrs} alt="" />
}

export default Poster
