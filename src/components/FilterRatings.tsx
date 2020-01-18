import React from 'react'
import { useFilter } from '../api/hooks'
import Ratings from './Ratings'
import styles from './FilterRatings.module.scss'

const FilterRatings = () => {
  const { selected, toggle } = useFilter()
  return <Ratings active={selected.best} onClick={toggle.best} className={styles.ratings} />
}

export default FilterRatings
