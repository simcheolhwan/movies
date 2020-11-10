import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { ThreeBarsIcon as ThreeBars } from "@primer/octicons-react"
import { useFilter } from "../api/hooks"
import FilterFooter from "./FilterFooter"
import MobileFilter from "./MobileFilter"
import styles from "./MobileNav.module.scss"

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
          <ThreeBars />
        </button>
        {selected.genre}
        <FilterFooter />
      </header>

      {isOpen && <MobileFilter />}
    </div>
  )
}

export default MobileNav
