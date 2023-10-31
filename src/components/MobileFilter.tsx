import { Link } from "react-router-dom"
import useLock from "../hooks/useLock"
import { useAuth } from "../api/hooks"
import Search from "./Search"
import Years from "./Years"
import Sort from "./Sort"
import Genres from "./Genres"
import styles from "./MobileFilter.module.scss"

const MobileFilter = () => {
  useLock()
  const [authenticated] = useAuth()

  return (
    <div className={styles.container}>
      {authenticated ? <Search /> : <Link to="/signin">Sign in</Link>}
      <Years />
      <Sort />

      <footer>
        <Genres />
      </footer>
    </div>
  )
}

export default MobileFilter
