import { Link } from "react-router-dom"
import classNames from "classnames"
import useYears from "../hooks/useYears"
import styles from "./Years.module.scss"

const Years = () => {
  const years = useYears()

  const renderYearLink = ({ isSelected, to, year }: Year) => {
    const className = classNames(styles.tab, isSelected && styles.active)
    const attrs = { to, className: className, children: year, key: year }
    return <Link {...attrs} />
  }

  return <section className={styles.tabs}>{years.map(renderYearLink)}</section>
}

export default Years
