import React, { useEffect } from 'react'
import { withRouter, Link } from 'react-router-dom'
import classNames from 'classnames'
import Octicon, { Home, Inbox, Plus } from '@primer/octicons-react'
import { useApp, useActions } from '../api/hooks'
import Genre from './Genre'
import styles from './Genre.module.scss'

const Genres = ({ selected }) => {
  const { authenticated, indexes } = useApp()
  const { genre: genres } = indexes
  const actions = useActions()

  const addGenre = () => {
    const input = (prompt() || '').trim()
    input && actions.addGenre(input)
  }

  const getIcon = icon => <Octicon icon={icon} />
  const menu = [
    { name: '', label: <>{getIcon(Home)} 전체 보기</> },
    { name: 'inbox', label: <>{getIcon(Inbox)} 분류 없음</> }
  ]

  useEffect(() => {
    const handleKeyDown = e => {
      const extended = ['', 'inbox', ...genres]
      const getNextIndex = { ArrowDown: +1, ArrowUp: -1 }

      e.altKey &&
        e.key &&
        console.log(extended[extended.findIndex(g => g === selected) + 1])
    }

    document.addEventListener('keydown', handleKeyDown)
    console.log(selected)
  }, [])

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

      {genres.map(genre => (
        <Genre isSelected={genre === selected} key={genre}>
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

export default withRouter(Genres)
