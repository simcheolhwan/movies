import React from "react"
import { useFilter } from "../api/hooks"
import styles from "./FilterInput.module.scss"

const FilterInput = () => {
  const { selected, set } = useFilter()

  return (
    <input
      value={selected.title}
      onChange={(e) => set.title!(e.target.value)}
      className={styles.input}
    />
  )
}

export default FilterInput
