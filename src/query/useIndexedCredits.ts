import { useState, useEffect } from 'react'
import L from 'localforage'

L.config({ name: 'credits' })

export default () => {
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

  const collect = ({ id, media_type }: TMDB) => async (credits: Credits) => {
    const next = { ...collection[media_type], [id]: credits }
    await L.setItem(media_type, next)
    setCollection({ ...collection, [media_type]: next })
  }

  return { isFetched, collection, collect }
}

/* helpers */
const getIndexedCredits = async (): Promise<CreditsCollection> => {
  const movie = (await L.getItem<CreditDB>('movie')) || {}
  const tv = (await L.getItem<CreditDB>('tv')) || {}
  return { movie, tv }
}
