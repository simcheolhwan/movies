import React, { useState } from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import classNames from 'classnames'
import { helpers, getMedia } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Poster from './Poster'
import Ratings from './Ratings'
import styles from './Movie.module.scss'

const Movie = movie => {
  const { tmdb, watched_at } = movie
  const { id, title, name } = tmdb

  const { updateMovie, moveMovie, removeMovie, refreshMovie } = useActions()
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'movie' },
    end: (item, monitor) => {
      const result = monitor.getDropResult()
      result && moveMovie(id, result.genre)
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  })

  const [isLoading, setIsLoading] = useState(false)

  /* events */
  const handleDoubleClick = async () => {
    setIsLoading(true)
    const media = await getMedia(tmdb)
    media && refreshMovie(id, media)
    setIsLoading(false)
  }

  const handleContextMenu = e => {
    e.preventDefault()
    window.confirm(`${title || name} 삭제`) && removeMovie(id)
  }

  const adjustWatchedAt = e => {
    e.stopPropagation()
    window.confirm(`${released}년으로 변경합니다.`) &&
      updateMovie(id, ['watched_at', released])
  }

  /* render */
  const link = helpers.getLink(tmdb)
  const type = helpers.getType(tmdb)
  const released = helpers.getYear(tmdb)

  const year =
    released === watched_at ? released : `${released} → ${watched_at}`

  const yearClassName = classNames(
    styles.year,
    (released > watched_at || isLoading) && styles.danger
  )

  return (
    <article
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      className={classNames(styles.component, isDragging && styles.isDragging)}
      ref={drag}
    >
      <Ratings {...movie} />
      <DragPreviewImage connect={preview} src={helpers.getPoster(tmdb, 92)} />
      <Poster movie={tmdb} w={342} className={styles.poster} />
      <h1 title={title || name} className={styles.title}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title || name}
        </a>
      </h1>
      <p className={yearClassName} onDoubleClick={adjustWatchedAt}>
        {isLoading ? '새로 가져오는 중' : year + (type && ` (${type})`)}
      </p>
    </article>
  )
}

export default Movie
