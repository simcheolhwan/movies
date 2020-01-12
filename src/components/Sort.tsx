import React from 'react'
import { useFilter } from '../api/hooks'
import styles from './Sort.module.scss'

const Sort = () => {
  const { selected, toggle } = useFilter()

  return (
    <section className={styles.container}>
      <button onClick={toggle.groupWith} className={styles.button}>
        {selected.groupWith ? '☑︎' : '☒'} 평가별 그룹
      </button>

      <button onClick={toggle.asc} className={styles.button}>
        정렬: 개봉일
        {selected.asc ? '↑' : '↓'}
      </button>
    </section>
  )
}

export default Sort
