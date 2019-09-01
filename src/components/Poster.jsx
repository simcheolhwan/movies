import React from 'react'
import classNames from 'classnames'
import styles from './Poster.module.scss'

export const getPoster = (w, path) => `https://image.tmdb.org/t/p/w${w}${path}`
const Poster = ({ w, path = '', className, ...props }) => {
  const width = props.width || w / 2

  const style = Object.assign(
    { width, height: width * 1.5 },
    path && { backgroundImage: `url(${getPoster(w, path)})` }
  )

  return (
    <div style={style} className={classNames(styles.background, className)} />
  )
}

export default Poster
