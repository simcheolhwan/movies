import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Octicon, { ThreeBars } from '@primer/octicons-react'
import { useFilter } from '../api/hooks'
import Search from './Search'
import Years from './Years'
import Sort from './Sort'
import Genres from './Genres'
import FilterFooter from './FilterFooter'
import styles from './MobileNav.module.scss'

const MobileNav = () => {
  const { pathname } = useLocation()
  const { selected } = useFilter()

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <button onClick={toggle} className={styles.toggle}>
          <Octicon icon={ThreeBars} />
        </button>
        {selected.genre}
        <FilterFooter />
      </header>

      {isOpen && (
        <div className={styles.container}>
          <Search />
          <Years />
          <Sort />

          <footer>
            <Genres />
          </footer>
        </div>
      )}
    </div>
  )
}

export default MobileNav
