import React, { useState, useEffect } from 'react'
import { cond, equals, sortBy, prop, reverse, compose } from 'ramda'
import api from '../api'
import { db } from '../firebase'

const Search = () => {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState()
  const [currentIndex, handleKeyDown] = useCurrent({ max: movies.length })

  useEffect(() => {
    /* API */
    const request = async query => {
      // TODO: debounce
      const params = { language: 'ko-KR', region: 'KR', query }
      try {
        // TODO: 직전 요청 취소
        const { data } = await api({ url: 'search/movie', params })
        const { results } = data
        results.length && setMovies(sortByProp('vote_count')(results))
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
  const addMovie = e => {
    e.preventDefault()
    const movie = movies[currentIndex]
    db.ref('movies/' + movie.id).set(movie)
  }

  /* render */
  const renderItem = (item, index) => (
    <li style={{ fontWeight: index === currentIndex && 'bold' }} key={item.id}>
      {item.title}
    </li>
  )

  // TODO: onEnter
  return (
    <form onSubmit={addMovie}>
      <input
        type="search"
        name="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoFocus
      />

      {error
        ? error.message
        : !!movies.length && <ul>{movies.map(renderItem)}</ul>}

      <button type="submit" disabled={!Number.isInteger(currentIndex)} />
    </form>
  )
}

export default Search

/* utils */
const sortByProp = p =>
  compose(
    reverse,
    sortBy(prop(p))
  )

/* hooks */
const useCurrent = ({ max }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const handleKeyDown = e =>
    cond([
      [
        equals('ArrowDown'),
        () => {
          e.preventDefault()
          setCurrentIndex(prev => {
            const next = Number.isInteger(prev) ? prev + 1 : 0
            return next < max ? next : 0
          })
        }
      ],
      [
        equals('ArrowUp'),
        () => {
          e.preventDefault()
          setCurrentIndex(prev => {
            const next = Number.isInteger(prev) ? currentIndex - 1 : max
            return next < 0 ? max - 1 : next
          })
        }
      ]
    ])(e.key)

  return [currentIndex, handleKeyDown]
}
