import React, { useState } from 'react'
import { useDrag, DragPreviewImage } from 'react-dnd'
import classNames from 'classnames'
import { helpers, getMedia } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Poster from './Poster'
import Ratings from './Ratings'
import styles from './Media.module.scss'

const Media: React.FC<Media> = media => {
  const { tmdb, watched_at } = media
  const title = helpers.getTitle(tmdb)

  const { updateMedia, moveMedia, removeMedia, refreshMedia } = useActions()
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: 'media' },
    end: (item, monitor) => {
      const result = monitor.getDropResult()
      result && moveMedia(tmdb, result.genre)
    },
    collect: monitor => ({ isDragging: !!monitor.isDragging() })
  })

  const [isLoading, setIsLoading] = useState(false)

  /* events */
  const handleDoubleClick = async () => {
    setIsLoading(true)
    const media = await getMedia(tmdb)
    media && refreshMedia(tmdb, media)
    setIsLoading(false)
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    window.confirm(`${title} 삭제`) && removeMedia(tmdb)
  }

  const adjustWatchedAt = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.confirm(`${released}년으로 변경합니다.`) &&
      updateMedia(tmdb, ['watched_at', released])
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
      <Ratings {...media} />
      <DragPreviewImage connect={preview} src={helpers.getPoster(tmdb, 92)} />
      <Poster media={tmdb} w={342} className={styles.poster} />
      <h1 title={title} className={styles.title}>
        <a href={link} target="_blank" rel="noopener noreferrer">
          {title}
        </a>
      </h1>
      <p className={yearClassName} onDoubleClick={adjustWatchedAt}>
        {isLoading ? '새로 가져오는 중' : year + (type && ` (${type})`)}
      </p>
    </article>
  )
}

export default Media
