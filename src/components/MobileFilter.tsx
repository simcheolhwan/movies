import React from 'react'
import useLock from '../hooks/useLock'
import Search from './Search'
import Years from './Years'
import Sort from './Sort'
import Genres from './Genres'
import styles from './MobileFilter.module.scss'

const MobileFilter = () => {
  useLock()

  return (
    <div className={styles.container}>
      <Search />
      <Years />
      <Sort />

      <footer>
        <Genres />
      </footer>
    </div>
  )
}

export default MobileFilter
