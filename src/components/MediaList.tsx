import { Link } from "react-router-dom"
import classNames from "classnames"
import { ThreeBarsIcon as ThreeBars } from "@primer/octicons-react"
import { useAuth, FilterProvider } from "../api/hooks"
import { useFilterReducer, useURLParams } from "../data/hooks"
import Search from "./Search"
import Genres from "./Genres"
import Filter from "./Filter"
import MobileNav from "./MobileNav"
import List from "./List"
import styles from "./MediaList.module.scss"

const Component = () => {
  const [authenticated] = useAuth()
  const value = useFilterReducer()

  return (
    <FilterProvider value={value}>
      {authenticated && (
        <header className={classNames("desktop", styles.header)}>
          <Search />
          <Link to="/menu" className={styles.menu}>
            <ThreeBars />
          </Link>
        </header>
      )}

      <section className={styles.content}>
        <nav className="desktop">
          <Genres />
        </nav>

        <main>
          <div className="desktop">
            <Filter />
          </div>

          <MobileNav />
          <List />
        </main>
      </section>
    </FilterProvider>
  )
}

const MediaList = () => {
  const { genre } = useURLParams()
  return <Component key={genre} />
}

export default MediaList
