import { useState, useEffect } from "react"
import L from "localforage"

L.config({ name: "credits" })

const useIndexedCredits = (): IndexedCredits => {
  const initial = { movie: {}, tv: {} }
  const [isFetched, setIsFetched] = useState(false)
  const [collection, setCollection] = useState<CreditsCollection>(initial)

  useEffect(() => {
    const storeCredits = async () => {
      setCollection(await getIndexedCredits())
      setIsFetched(true)
    }

    storeCredits()
  }, [])

  const collect = async (media_type: MediaType, creditsDB: CreditsDB) => {
    const next = { ...collection[media_type], ...creditsDB }
    await L.setItem(media_type, next)
    setCollection({ ...collection, [media_type]: next })
  }

  return { isFetched, collection, collect }
}

export default useIndexedCredits

/* helpers */
const getIndexedCredits = async (): Promise<CreditsCollection> => {
  const movie = (await L.getItem<CreditsDB>("movie")) || {}
  const tv = (await L.getItem<CreditsDB>("tv")) || {}
  return { movie, tv }
}
