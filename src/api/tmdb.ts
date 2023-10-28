import axios, { AxiosRequestConfig } from "axios"

const api_key = "1f65910a7e34c5d109daa353a4cf53ab"

const api = <T>(url: string, params?: AxiosRequestConfig["params"]) => {
  const config = {
    baseURL: "https://api.themoviedb.org/3",
    params: Object.assign({ api_key }, params),
  }

  return axios.get<T>(url, config)
}

/* Multi */
export const searchMulti = async (query: string) => {
  const config = { query, language: "ko-KR" }
  const { data } = await api<{ results: TMDB[] }>("search/multi", config)
  const { results } = data
  return results.filter((result) => ["movie", "tv"].includes(result.media_type)).sort(sortByProp<TMDB>("vote_count"))
}

/* Media */
export const fetchMedia = async (tmdb: TMDB): Promise<TMDB> => {
  type Details = Omit<MovieTMDB, "media_type"> | Omit<TvTMDB, "media_type">
  const { id, media_type, original_language: language } = tmdb
  const config = { language }
  const { data: detail } = await api<Details>(`${media_type}/${id}`, config)
  return { ...detail, media_type }
}

export const fetchCredits = async (tmdb: TMDB): Promise<Credits> => {
  const { id, media_type } = tmdb
  const { data: credits } = await api<Credits>(`${media_type}/${id}/credits`)
  return credits
}

/* helpers */
const getDate = (tmdb: TMDB) => ("release_date" in tmdb ? tmdb.release_date : tmdb.first_air_date) || ""

export const helpers = {
  getLink: (tmdb: TMDB) => `https://www.themoviedb.org/${tmdb.media_type}/${tmdb.id}`,
  getPoster: (tmdb: TMDB, w: number) => `https://image.tmdb.org/t/p/w${w}${tmdb.poster_path}`,
  getPersonLink: (id: number) => `https://www.themoviedb.org/person/${id}`,

  getDate,
  getYear: (tmdb: TMDB) => new Date(getDate(tmdb)).getFullYear(),

  getTitle: (tmdb: TMDB) => ("title" in tmdb ? tmdb.title : tmdb.name) || "",
  getOriginal: (tmdb: TMDB) => ("original_title" in tmdb ? tmdb.original_title : tmdb.original_name) || "",

  getType: (tmdb: TMDB) => (tmdb.media_type && tmdb.media_type !== "movie" ? tmdb.media_type.toUpperCase() : ""),

  getMarvel: (tmdb: TMDB) => tmdb.production_companies?.some(({ name }) => name.startsWith("Marvel")),
}

/* utils */
const sortByProp = <T>(p: keyof T) => {
  return (a: T, b: T) => (a[p] === b[p] ? 0 : a[p] > b[p] ? -1 : 1)
}
