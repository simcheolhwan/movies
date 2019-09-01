import React from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import classNames from 'classnames'
import { useActions } from '../api/hooks'
import Poster from './Poster'
import styles from './Movie.module.scss'

const Movie = ({ tmdb: { id, title, poster_path } }) => {
  const { moveMovie } = useActions()

  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'movie' },
    end: (item, monitor) => {
      const result = monitor.getDropResult()
      result && moveMovie(id, result.genre)
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  })

  const previewImage = `http://image.tmdb.org/t/p/w92${poster_path}`
  return (
    <article
      className={classNames(styles.component, isDragging && styles.isDragging)}
      ref={drag}
    >
      <DragPreviewImage connect={preview} src={previewImage} />
      <Poster w={342} path={poster_path} className={styles.poster} />
      <h1 className={styles.title}>{title}</h1>
    </article>
  )
}

export default Movie
