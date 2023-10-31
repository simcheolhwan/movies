import { useState } from "react"
import Results from "./Results"
import styles from "./Query.module.scss"

const Query = () => {
  const [crew, setCrew] = useState<Q["crew"]>(["job", ""])
  const [cast, setCast] = useState<Q["cast"]>(false)

  const showByCast = () => {
    setCrew(["job", ""])
    setCast(true)
  }

  const showByDirector = () => {
    setCrew(["job", "Director"])
    setCast(false)
  }

  return (
    <>
      <header className={styles.header}>
        <button onClick={showByCast}>Cast</button>
        <button onClick={showByDirector}>Director</button>
      </header>

      <Results crew={crew} cast={cast} />
    </>
  )
}

export default Query
