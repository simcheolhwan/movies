import React from 'react'
import { Link } from 'react-router-dom'
import { useDrop } from 'react-dnd'
import classNames from 'classnames'
import styles from './Genre.module.scss'

const Genre = ({ isSelected, children: genre }) => {
  const [{ isOver }, drop] = useDrop({
    accept: 'movie',
    drop: () => ({ genre }),
    collect: monitor => ({ isOver: !!monitor.isOver() })
  })

  const attrs = {
    to: genre,
    className: classNames(
      styles.link,
      isOver && styles.isOver,
      isSelected && styles.active
    )
  }

  return (
    <Link {...attrs} innerRef={drop}>
      {genre}
    </Link>
  )
}

export default Genre
