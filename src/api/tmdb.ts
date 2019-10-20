import axios, { AxiosRequestConfig } from 'axios'

const api_key = '1f65910a7e34c5d109daa353a4cf53ab'
const language = 'ko-KR'

const api = <T>(url: string, params?: AxiosRequestConfig['params']) => {
  const config = {
    baseURL: 'https://api.themoviedb.org/3',
    params: Object.assign({ api_key, language }, params)
  }

  return axios.get<T>(url, config)
}

/* Multi */
export const searchMulti = async (query: string) => {
  const { data } = await api<{ results: TMDB[] }>('search/multi', { query })
  const { results } = data
  return results.filter(result => ['movie', 'tv'].includes(result.media_type))
}

/* Media */
export const getMedia = async ({ id, media_type }: TMDB) => {
  const { data } = await api<TMDB>(`${media_type}/${id}`)
  return data && { ...data, media_type }
}

/* helpers */
const getDate = (tmdb: TMDB) =>
  ('release_date' in tmdb ? tmdb.release_date : tmdb.first_air_date) || ''

export const helpers = {
  getLink: (tmdb: TMDB) =>
    `https://www.themoviedb.org/${tmdb.media_type}/${tmdb.id}`,
  getPoster: (tmdb: TMDB, w: number) =>
    `https://image.tmdb.org/t/p/w${w}${tmdb.poster_path}`,

  getDate,
  getYear: (tmdb: TMDB) => new Date(getDate(tmdb)).getFullYear() || '',

  getTitle: (tmdb: TMDB) => ('title' in tmdb ? tmdb.title : tmdb.name) || '',
  getType: (tmdb: TMDB) =>
    tmdb.media_type && tmdb.media_type !== 'movie'
      ? tmdb.media_type.toUpperCase()
      : ''
}
