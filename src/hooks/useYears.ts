import { useDatabase, useFilter } from "../api/hooks"

export default (): Year[] => {
  const [, indexes] = useDatabase()
  const { selected } = useFilter()
  const l = selected.watched_at.length === 1

  return indexes.watched_at.map((year) => {
    const isSelected = selected.watched_at.includes(year)
    const w = selected.watched_at
    const duration = [w, year].sort().join("-")
    const next = isSelected ? "" : `?watched_at=${l ? duration : year}`
    return { year, isSelected, to: { search: next } }
  })
}
