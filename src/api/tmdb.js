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
const language = 'ko-KR'

export const searchMovies = async query => {
  const params = { language, query }
  const { data } = await api({ url: 'search/multi', params })
  const { results } = data
  return sortByProp('vote_count')(results)
}

export const getMedia = async ({ id, media_type }) => {
  const params = { language }
  const { data } = await api({ url: `${media_type}/${id}`, params })
  return data && { ...data, media_type }
}

/* helpers */
export const helpers = {
  getLink: tmdb => `https://www.themoviedb.org/movie/${tmdb.id}`,
  getPoster: (tmdb, w) => `https://image.tmdb.org/t/p/w${w}${tmdb.poster_path}`,
  getYear: tmdb =>
    new Date(tmdb.release_date || tmdb.first_air_date).getFullYear() || '',
  getType: tmdb =>
    tmdb.media_type && tmdb.media_type !== 'movie'
      ? tmdb.media_type.toUpperCase()
      : ''
}

/* utils */
const sortByProp = p =>
  compose(
    reverse,
    sortBy(propOr(0, p))
  )
