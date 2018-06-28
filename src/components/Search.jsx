import React, { Component, Fragment } from 'react'
import debounce from 'lodash/fp/debounce'
import { cond, equals } from 'ramda'
import axios from 'axios'
import api, { api_key } from '../api'

class Search extends Component {
  name = 'search'
  InitialState = { movies: [], error: {}, currentIndex: NaN }
  state = { [this.name]: '', ...this.InitialState }

  /* event */
  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value }, () => {
      // 쿼리를 요청한다. 단, 인풋이 모두 지워지면 데이터도 지운다.
      const query = this.state[this.name].trim()
      query ? this.search(query) : this.reset()
    })

  handleKeyDown = event =>
    cond([
      [
        equals('Enter'),
        () => console.info(JSON.stringify(this.getCurrentMovie(), null, 2))
      ],
      [
        equals('ArrowDown'),
        () =>
          this.setState(prev => {
            const { currentIndex, movies } = prev
            const next = Number.isInteger(currentIndex) ? currentIndex + 1 : 0
            return { currentIndex: next < movies.length ? next : 0 }
          })
      ],
      [
        equals('ArrowUp'),
        () =>
          this.setState(prev => {
            const { currentIndex, movies } = prev
            const next = Number.isInteger(currentIndex)
              ? currentIndex - 1
              : movies.length
            return { currentIndex: next < 0 ? movies.length - 1 : next }
          })
      ]
    ])(event.key)

  /* API */
  search = debounce(100)(async query => {
    const url = 'search/movie'
    const params = { api_key, language: 'ko-KR', region: 'KR', query }
    const request = { ...api, url, params }

    try {
      const { data } = await axios(request)
      const { results = [] } = data
      const movies = results.sort(sortWith('vote_count'))

      // 응답이 온 후에 인풋이 비어있으면 데이터를 지운다.
      const isBlank = !this.state[this.name]
      movies.length && this.setState({ movies }, () => isBlank && this.reset())
    } catch (error) {
      this.setState({ error })
    }
  })

  /* Data */
  getCurrentMovie = () => this.state.movies[this.state.currentIndex]
  reset = () => this.setState(this.InitialState)

  /* render */
  renderItem = (item, index) => (
    <li
      style={{ backgroundColor: index === this.state.currentIndex && 'silver' }}
      key={item.id}
    >
      {item.title}
    </li>
  )

  render() {
    const { movies, error } = this.state

    return (
      <Fragment>
        <input
          name={this.name}
          value={this.state[this.name]}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />

        {error.message ||
          (!!movies.length && <ul>{movies.map(this.renderItem)}</ul>)}
      </Fragment>
    )
  }
}

export default Search

/* Utility */
const sortWith = key => (a, b) => b[key] - a[key]
