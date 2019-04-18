import React, { useState, useEffect } from 'react'
import { cond, equals, sortBy, prop, reverse, compose } from 'ramda'
import api from '../api'

const Search = () => {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState([])
  const [error, setError] = useState()
  const [currentIndex, handleKeyDown] = useCurrent({ max: movies.length })

  useEffect(() => {
    const query = search.trim()
    query ? request(query) : reset() // 입력이 비면 내용도 비운다.
  }, [search])

  const reset = () => {
    setSearch('')
    setMovies([])
    setError()
  }

  /* API */
  const request = async query => {
    // TODO: debounce
    const params = { language: 'ko-KR', region: 'KR', query }
    try {
      // TODO: 직전 요청 취소
      const { data } = await api({ url: 'search/movie', params })
      const { results } = data
      results.length && setMovies(sortByVoteCount(results))
    } catch (error) {
      setError(error)
    }
  }

  /* render */
  const renderItem = (item, index) => (
    <li style={{ fontWeight: index === currentIndex && 'bold' }} key={item.id}>
      {item.title}
    </li>
  )

  // TODO: onEnter
  return (
    <>
      <input
        type="search"
        name="search"
        value={search}
        onChange={e => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
        autoFocus
      />

      {error
        ? error.message
        : !!movies.length && <ul>{movies.map(renderItem)}</ul>}
    </>
  )
}

export default Search

/* utils */
const sortByVoteCount = compose(
  reverse,
  sortBy(prop('vote_count'))
)

/* hooks */
const useCurrent = ({ max }) => {
  const [currentIndex, setCurrentIndex] = useState()

  const handleKeyDown = e =>
    cond([
      [
        equals('ArrowDown'),
        () =>
          setCurrentIndex(prev => {
            const next = Number.isInteger(prev) ? prev + 1 : 0
            return next < max ? next : 0
          })
      ],
      [
        equals('ArrowUp'),
        () =>
          setCurrentIndex(prev => {
            const next = Number.isInteger(prev) ? currentIndex - 1 : max
            return next < 0 ? max - 1 : next
          })
      ]
    ])(e.key)

  return [currentIndex, handleKeyDown]
}
