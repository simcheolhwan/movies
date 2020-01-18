import React from 'react'
import Octicon, { OcticonProps } from '@primer/octicons-react'
import { Home, Inbox } from '@primer/octicons-react'
import { useDatabase, useFilter } from '../api/hooks'

export default (): Genre[] => {
  const { selected } = useFilter()
  const [{ movie, tv }, indexes] = useDatabase()

  const getIcon = (icon: OcticonProps['icon']) => <Octicon icon={icon} />

  const menu = [
    { to: '', label: '전체보기', icon: getIcon(Home), isMenu: true },
    { to: 'inbox', label: '분류 없음', icon: getIcon(Inbox), isMenu: true }
  ]

  return [
    ...menu.map(item => ({
      ...item,
      isSelected: item.to === (selected.genre ?? '')
    })),
    ...indexes.genre.map(genre => {
      const getLength = (media: MediaDB) =>
        Object.values(media).filter(m => m.genre === genre).length

      const count = getLength(movie) + getLength(tv)

      return {
        to: genre,
        label: genre,
        count: count,
        isSelected: genre === selected.genre
      }
    })
  ]
}
