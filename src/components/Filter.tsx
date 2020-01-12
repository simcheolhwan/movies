import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth, useFilter } from '../api/hooks'
import Years from './Years'
import Sort from './Sort'
import Ratings from './Ratings'
import MobileNav from './MobileNav'
import styles from './Filter.module.scss'

const Filter = () => {
  const [authenticated] = useAuth()
  const { selected, count, toggle, set } = useFilter()

  const link = `검색결과 ${count}개`

  return (
    <div className={styles.component}>
      <header className="desktop">
        <Years />
      </header>

      <main className={styles.main}>
        <MobileNav />

        <section className="desktop">
          <Sort />
        </section>

        <footer className={styles.footer}>
          <Ratings active={selected.best} onClick={toggle.best} />

          <strong className={styles.link}>
            {authenticated ? (
              <a href="/">{link}</a>
            ) : (
              <Link to="/signin">{link}</Link>
            )}
          </strong>

          <input
            value={selected.title}
            onChange={e => set.title!(e.target.value)}
            className={styles.input}
          />
        </footer>
      </main>
    </div>
  )
}

export default Filter
