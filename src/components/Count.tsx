import { Link } from "react-router-dom"
import { useAuth, useFilter } from "../api/hooks"
import styles from "./Count.module.scss"

const Count = () => {
  const [authenticated] = useAuth()
  const { count } = useFilter()

  const link = `검색결과 ${count}개`

  return authenticated ? (
    <a href="/" className={styles.link}>
      {link}
    </a>
  ) : (
    <Link to="/signin" className={styles.link}>
      {link}
    </Link>
  )
}

export default Count
