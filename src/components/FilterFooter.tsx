import FilterRatings from "./FilterRatings"
import FilterInput from "./FilterInput"
import Count from "./Count"
import styles from "./FilterFooter.module.scss"

const FilterFooter = () => (
  <footer className={styles.footer}>
    <FilterRatings />
    <Count />
    <FilterInput />
  </footer>
)

export default FilterFooter
