import React from 'react'
import { Link, LinkProps } from 'react-router-dom'
import { useDrop } from 'react-dnd'
import classNames from 'classnames'
import { useActions } from '../api/hooks'
import styles from './Genre.module.scss'

interface Props {
  isSelected: boolean
  count: number
  children: string
}

const Genre = ({ isSelected, count, children: genre }: Props) => {
  const { changeGenre } = useActions()
  const [{ isOver }, drop] = useDrop({
    accept: 'media',
    drop: () => ({ genre }),
    collect: monitor => ({ isOver: !!monitor.isOver() })
  })

  const attrs: LinkProps = {
    to: genre,
    innerRef: drop,
    className: classNames(
      styles.link,
      Number.isFinite(count) && styles.flex,
      isOver && styles.isOver,
      isSelected && styles.active
    ),
    onContextMenu: e => {
      e.preventDefault()
      const next = (window.prompt(`장르 이름 변경: ${genre}`) || '').trim()
      next && changeGenre(genre, next)
    }
  }

  return (
    <Link {...attrs}>
      <span>{genre}</span>
      <small>{count}</small>
    </Link>
  )
}

export default Genre
