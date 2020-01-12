import { useDatabase, useFilter } from '../api/hooks'

export default (): Year[] => {
  const [, indexes] = useDatabase()
  const { selected } = useFilter()

  return indexes.watched_at.map(year => {
    const isSelected = year === selected.watched_at
    const next = isSelected ? '' : `?watched_at=${year}`
    return { year, isSelected, to: { search: next } }
  })
}
