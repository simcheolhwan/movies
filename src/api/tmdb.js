import { sortBy, prop, reverse, compose } from 'ramda'
import axios from 'axios'

const api_key = process.env.REACT_APP_TMDB_API_KEY

const api = ({ params, ...rest }) => {
  const request = Object.assign(
    { baseURL: 'https://api.themoviedb.org/3' },
    params && { params: { api_key, ...params } },
    rest
  )

  return axios(request)
}

/* Movies */
export const searchMovies = async query => {
  const params = { language: 'ko-KR', region: 'KR', query }
  const { data } = await api({ url: 'search/multi', params })
  const { results } = data
  return sortByProp('vote_count')(results)
}

/* utils */
const sortByProp = p =>
  compose(
    reverse,
    sortBy(prop(p))
  )
