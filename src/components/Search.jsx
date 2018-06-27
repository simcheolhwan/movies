import React, { Component, Fragment } from 'react'
import debounce from 'lodash/fp/debounce'
import axios from 'axios'
import api, { api_key } from '../api'

class Search extends Component {
  name = 'search'
  InitialState = { response: [], error: {} }
  state = { [this.name]: '', ...this.InitialState }

  handleChange = event =>
    this.setState({ [event.target.name]: event.target.value }, () => {
      // 쿼리를 요청한다. 단, 인풋이 모두 지워지면 데이터도 지운다.
      const query = this.state[this.name].trim()
      query ? this.search(query) : this.reset()
    })

  reset = () => this.setState(this.InitialState)

  search = debounce(100)(async query => {
    const url = 'search/movie'
    const params = { api_key, language: 'ko-KR', region: 'KR', query }
    const request = { ...api, url, params }

    try {
      const { data } = await axios(request)
      const { results = [] } = data
      const response = results.sort(sortWith('vote_count'))

      // 응답이 온 후에 인풋이 비어있으면 데이터를 지운다.
      const isBlank = !this.state[this.name]
      response.length &&
        this.setState({ response }, () => isBlank && this.reset())
    } catch (error) {
      this.setState({ error })
    }
  })

  render() {
    const { response, error } = this.state

    return (
      <Fragment>
        <input
          name={this.name}
          value={this.state[this.name]}
          onChange={this.handleChange}
        />

        {error.message ||
          (!!response.length && (
            <ul>{response.map(item => <li key={item.id}>{item.title}</li>)}</ul>
          ))}
      </Fragment>
    )
  }
}

export default Search

/* Utility */
const sortWith = key => (a, b) => b[key] - a[key]
