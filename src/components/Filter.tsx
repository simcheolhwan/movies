import Years from "./Years"
import Sort from "./Sort"
import FilterFooter from "./FilterFooter"
import styles from "./Filter.module.scss"

const Filter = () => (
  <div className={styles.component}>
    <Years />

    <main className={styles.main}>
      <Sort />
      <FilterFooter />
    </main>
  </div>
)

export default Filter
