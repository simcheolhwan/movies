import { sortBy, propOr, reverse, compose } from 'ramda'
import axios from 'axios'

const api_key = '1f65910a7e34c5d109daa353a4cf53ab'

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

/* helpers */
export const helpers = {
  getLink: tmdb => `https://www.themoviedb.org/movie/${tmdb.id}`,
  getYear: tmdb =>
    new Date(tmdb.release_date || tmdb.first_air_date).getFullYear() || '',
  getType: tmdb =>
    tmdb.media_type !== 'movie' ? tmdb.media_type.toUpperCase() : ''
}

/* utils */
const sortByProp = p =>
  compose(
    reverse,
    sortBy(propOr(0, p))
  )
