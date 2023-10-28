import { useApp, useDatabase, useAuth } from "../api/hooks"
import useIndexedCredits from "./useIndexedCredits"
import List from "./List"
import styles from "./Collect.module.scss"

interface Props extends IndexedCredits {
  media: MediaDB
  media_type: MediaType
}

const Container = ({ media, media_type, ...indexed }: Props) => {
  type Entry = [string, Media]
  const isCollected = ([id]: Entry) => !!indexed.collection[media_type][id]
  const isNotCollected = ([id]: Entry) => !indexed.collection[media_type][id]

  // 수집한 항목을 앞으로 정렬시키고 그루핑한다.
  const entries = Object.entries<Media>(media)
  const sorted = [...entries.filter(isCollected), ...entries.filter(isNotCollected)]

  // N개씩 묶는다.
  const N = 100
  const group = Array.from({ length: Math.ceil(sorted.length / N) }, (_, i) => sorted.slice(i * N, (i + 1) * N))

  // 수집하지 않은 항목이 하나라도 있는 첫 번째 인덱스를 찾는다. (지금 수행해야할 인덱스)
  const currentIndex = group.findIndex((entries) => entries.some(isNotCollected))

  return (
    <div className={styles.container}>
      {group.map((list, index) => (
        <List
          {...indexed}
          list={list}
          status={index === currentIndex ? 0 : index > currentIndex ? -1 : 1}
          media_type={media_type}
          key={index}
        />
      ))}
    </div>
  )
}

const Collect = () => {
  const { hydrated } = useApp()
  const [authenticated] = useAuth()
  const [media] = useDatabase()
  const indexed = useIndexedCredits()

  const isMediaCollected = (media_type: MediaType) =>
    Object.keys(media[media_type]).every((id) => !!indexed.collection[media_type][id])

  const isReady = authenticated && hydrated && indexed.isFetched
  const isTvCollected = isMediaCollected("tv")
  const isMovieCollected = isMediaCollected("movie")
  const isCollected = isTvCollected && isMovieCollected

  return !isReady ? null : isCollected ? (
    <>완료</>
  ) : (
    <Container
      {...indexed}
      media={!isTvCollected ? media["tv"] : media["movie"]}
      media_type={!isTvCollected ? "tv" : "movie"}
      key={Number(isTvCollected)}
    />
  )
}

export default Collect
