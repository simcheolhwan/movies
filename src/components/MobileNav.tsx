import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Octicon, { ThreeBars } from '@primer/octicons-react'
import { useFilter } from '../api/hooks'
import Years from './Years'
import Sort from './Sort'
import Genres from './Genres'
import styles from './MobileNav.module.scss'

const MobileNav = () => {
  const { pathname } = useLocation()
  const { selected } = useFilter()

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const button = (
    <button onClick={toggle} className={styles.toggle}>
      <Octicon icon={ThreeBars} />
    </button>
  )

  return (
    <div className={styles.component}>
      {!isOpen ? (
        <header className={styles.header}>
          {button}
          {selected.genre}
        </header>
      ) : (
        <div className={styles.container}>
          <header className={styles.header}>
            {button}
            <Years />
          </header>
          <Sort />
          <Genres />
        </div>
      )}
    </div>
  )
}

export default MobileNav
