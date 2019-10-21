import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import Octicon, { OcticonProps } from '@primer/octicons-react'
import { Home, Inbox, Plus } from '@primer/octicons-react'
import { useApp, useActions } from '../api/hooks'
import Genre from './Genre'
import styles from './Genre.module.scss'

const Genres = ({ selected }: { selected: string }) => {
  const { authenticated, indexes, movie, tv } = useApp()
  const actions = useActions()

  const media = { ...movie, ...tv }

  const addGenre = () => {
    const input = (prompt() || '').trim()
    input && actions.addGenre(input)
  }

  const getIcon = (icon: OcticonProps['icon']) => <Octicon icon={icon} />
  const menu = [
    { name: '', label: <>{getIcon(Home)} 전체 보기</> },
    { name: 'inbox', label: <>{getIcon(Inbox)} 분류 없음</> }
  ]

  return (
    <>
      {menu.map(({ name, label }) => {
        const attrs = {
          to: name,
          className: classNames(styles.link, selected === name && styles.active)
        }

        return (
          <Link {...attrs} key={name}>
            {label}
          </Link>
        )
      })}

      {indexes.genre.map(genre => (
        <Genre
          isSelected={genre === selected}
          count={Object.values(media).filter(m => m.genre === genre).length}
          key={genre}
        >
          {genre}
        </Genre>
      ))}

      {authenticated && (
        <button onClick={addGenre} className={styles.link}>
          <Octicon icon={Plus} /> 새 장르 추가
        </button>
      )}
    </>
  )
}

export default Genres
