import React from 'react'
import classNames from 'classnames'
import styles from './Poster.module.scss'

const Poster = ({ w, path = '', className, ...props }) => {
  const width = props.width || w / 2

  const style = Object.assign(
    { width, height: width * 1.5 },
    path && { backgroundImage: `url(http://image.tmdb.org/t/p/w${w}${path})` }
  )

  return (
    <div style={style} className={classNames(styles.background, className)} />
  )
}

export default Poster
