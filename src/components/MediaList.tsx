import React from "react"
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
        <header className="desktop">
          <Search />
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
