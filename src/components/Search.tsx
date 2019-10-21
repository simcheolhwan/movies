import React, { useState, useEffect, useRef } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { searchMulti } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Results from './Results'
import styles from './Search.module.scss'

const Search = ({ location }: RouteComponentProps) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [list, setList] = useState<TMDB[]>([])
  const [error, setError] = useState()

  const { addMedia } = useActions()

  useEffect(() => {
    /* API */
    const request = async (query: string) => {
      // TODO: debounce, cancel
      setError(null)

      try {
        const list = await searchMulti(query)
        list.length && setList(list)
      } catch (error) {
        setError(error)
      }
    }

    const query = search.trim()
    query ? request(query) : reset() // 입력이 비면 내용도 비운다.
  }, [search])

  const reset = () => {
    setSearch('')
    setList([])
    setError(undefined)
  }

  /* actions */
  const add = (index: number) => {
    const pathname = location.pathname.slice(1)
    const genre = pathname === 'inbox' ? '' : pathname
    addMedia(list[index], { genre, ratings: {} })
    reset()
    inputRef.current && inputRef.current.focus()
  }

  const submit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    add(0)
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <input
        type="search"
        name="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        autoComplete="off"
        autoFocus
        ref={inputRef}
      />

      {error
        ? error.message
        : !!list.length && <Results results={list} onAdd={add} />}

      <button type="submit" disabled={!list.length} />
    </form>
  )
}

export default withRouter(Search)
