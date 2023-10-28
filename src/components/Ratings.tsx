import { HTMLAttributes } from "react"
import classNames from "classnames"
import { StarFillIcon as Star } from "@primer/octicons-react"
import styles from "./Ratings.module.scss"

interface Props extends HTMLAttributes<HTMLButtonElement> {
  active: boolean
}

const Ratings = ({ active, onClick, className }: Props) => (
  <section className={className}>
    <button className={classNames(styles.button, active && styles.active)} onClick={onClick}>
      <Star />
    </button>
  </section>
)

export default Ratings
