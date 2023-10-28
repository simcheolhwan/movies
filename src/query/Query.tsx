import { useState } from "react"
import Form from "./Form"
import Results from "./Results"
import styles from "./Query.module.scss"

const Query = () => {
  const [crew, setCrew] = useState<Q["crew"]>(["job", ""])
  const [cast, setCast] = useState<Q["cast"]>(false)

  return (
    <>
      <header className={styles.header}>
        <label>
          <input type="checkbox" checked={cast} onChange={() => setCast(!cast)} />
          Cast
        </label>

        <Form onSubmit={setCrew} />
      </header>

      <Results crew={crew} cast={cast} />
    </>
  )
}

export default Query
