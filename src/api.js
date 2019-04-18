import axios from 'axios'
export const api_key = process.env.REACT_APP_TMDB_API_KEY
export default ({ params, ...rest }) => {
  const request = Object.assign(
    { baseURL: 'https://api.themoviedb.org/3' },
    params && { params: { api_key, ...params } },
    rest
  )

  return axios(request)
}
