import React, { useState, useEffect, useRef } from 'react'
import { withRouter } from 'react-router-dom'
import { searchMovies } from '../api/tmdb'
import { useActions } from '../api/hooks'
import Poster from './Poster'
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

  /* render */
  const renderItem = (item, index) => {
    const { id, title, name, poster_path, release_date, first_air_date } = item
    const date = release_date || first_air_date
    return (
      <li className={styles.item} key={id}>
        <button onClick={() => add(index)} className={styles.movie}>
          <Poster w={92} path={poster_path} className={styles.poster} />
          <main>
            <h1>{title || name}</h1>
            {date && (
              <time dateTime={date} className={styles.year}>
                {new Date(date).getFullYear()}
              </time>
            )}
          </main>
        </button>
      </li>
    )
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
        : !!movies.length && (
            <section className={styles.results}>
              <h1 className={styles.title}>검색 결과</h1>
              <ul className={styles.list}>{movies.map(renderItem)}</ul>
            </section>
          )}

      <button type="submit" disabled={!movies.length} />
    </form>
  )
}

export default withRouter(Search)
