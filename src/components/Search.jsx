import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { searchMovies } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Results from './Results'
import styles from './Search.module.scss'

const Search = ({ location }) => {
  const inputRef = useRef(null)

  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState()

  const { addMovie } = useActions()

  useEffect(() => {
    /* API */
    const request = async query => {
      // TODO: debounce, cancel
      setError(null)

      try {
        const movies = await searchMovies(query)
        movies.length && setMovies(movies)
      } catch (error) {
        setError(error)
      }
    }

    const query = search.trim()
    query ? request(query) : reset() // 입력이 비면 내용도 비운다.
  }, [search])

  const reset = () => {
    setSearch('')
    setMovies([])
    setError()
  }

  /* actions */
  const add = index => {
    const pathname = location.pathname.slice(1)
    const genre = pathname === 'inbox' ? '' : pathname
    addMovie(movies[index], { genre })
    reset()
    inputRef.current.focus()
  }

  const submit = e => {
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
        : !!movies.length && <Results results={movies} onAdd={add} />}

      <button type="submit" disabled={!movies.length} />
    </form>
  )
}

export default withRouter(Search)
