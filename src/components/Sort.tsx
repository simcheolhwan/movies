import { useFilter } from "../api/hooks"
import styles from "./Sort.module.scss"

const Sort = () => {
  const { selected, toggle } = useFilter()

  return (
    <section className={styles.container}>
      <button onClick={toggle.groupWith} className={styles.button}>
        <span className={styles.checkbox}>
          {selected.groupWith ? "✓" : "✗"}
        </span>
        평가별 그룹
      </button>

      <button onClick={toggle.asc} className={styles.button}>
        <span className={styles.checkbox}>{selected.asc ? "↑" : "↓"}</span>
        정렬: 개봉일
      </button>

      <button onClick={toggle.shuffle} className={styles.button}>
        <span className={styles.checkbox}>{selected.shuffle ? "✓" : "✗"}</span>
        무작위
      </button>
    </section>
  )
}

export default Sort
