import { useState, useEffect, useCallback } from "react"
import Item from "./Item"
import styles from "./List.module.scss"

interface Props extends IndexedCredits {
  list: [string, Media][]
  status: number
  media_type: MediaType
}

const List = ({ list, status, media_type, collect }: Props) => {
  const isCollected = (id: string) => !!buffer[id]
  const active = status === 0
  const collected = status === 1

  // 버퍼에 하나씩 채우다가, 버퍼가 꽉차면 수집 함수에 전달한다.
  const [buffer, setBuffer] = useState<CreditsDB>({})
  const isFull = list.length === Object.keys(buffer).length

  const submit = useCallback(async () => {
    collect(media_type, buffer)
  }, [media_type, buffer, collect])

  useEffect(() => {
    active && isFull && submit()
  }, [active, isFull, submit])

  return (
    <ul className={styles.list}>
      {list.map(([id, { tmdb }], index) => {
        const [prevId] = list[index - 1] ?? []
        const prevHasCredits = isCollected(prevId)
        const hasCredits = isCollected(id)
        const shouldUpdate =
          active && !index ? !hasCredits : prevHasCredits && !hasCredits

        return (
          <Item
            tmdb={tmdb}
            hasCredits={collected || isCollected(id)}
            shouldUpdate={shouldUpdate}
            onFetchCredits={(credits) =>
              setBuffer({ ...buffer, [id]: credits })
            }
            key={id}
          />
        )
      })}
    </ul>
  )
}

export default List
