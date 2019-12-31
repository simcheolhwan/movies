import React, { HTMLAttributes } from 'react'
import classNames from 'classnames'
import Octicon from '@primer/octicons-react'
import { Star } from '@primer/octicons-react'
import styles from './Ratings.module.scss'

interface Props extends HTMLAttributes<HTMLButtonElement> {
  active: boolean
}

const Ratings = ({ active, onClick, className }: Props) => (
  <section className={className}>
    <button
      className={classNames(styles.button, active && styles.active)}
      onClick={onClick}
    >
      <Octicon icon={Star} />
    </button>
  </section>
)

export default Ratings
