import React from 'react'
import classNames from 'classnames'
import Octicon, { OcticonProps } from '@primer/octicons-react'
import { Star, Bookmark, CircleSlash } from '@primer/octicons-react'
import { Thumbsup, Thumbsdown, Check } from '@primer/octicons-react'
import styles from './Ratings.module.scss'

enum Keys {
  BEST = 'best',
  INCREASE = 'increase',
  DECREASE = 'decrease',
  RESET = 'reset',
  FORGET = 'forget',
  BOOKMARK = 'bookmark'
}

interface Attrs {
  active: boolean
  onClick: () => void
}

const icons: { [K in Keys]: OcticonProps['icon'] } = {
  best: Star,
  increase: Thumbsup,
  decrease: Thumbsdown,
  reset: Check,
  forget: CircleSlash,
  bookmark: Bookmark
}

const activeClassNames: { [K in Keys]?: string } = {
  bookmark: styles.bookmark
}

const Ratings = ({ buttons }: { buttons: { [K in Keys]: Attrs } }) => {
  const renderButton = (key: Keys) => {
    const icon = icons[key]
    const { active, onClick } = buttons[key]
    const activeClassName = activeClassNames[key] || styles.active
    const className = classNames(styles.button, active && activeClassName)

    return (
      <button className={className} onClick={onClick}>
        <Octicon icon={icon} />
      </button>
    )
  }

  return (
    <footer className={styles.component}>
      {renderButton(Keys.BEST)}

      <section className={styles.grade}>
        {renderButton(Keys.INCREASE)}
        {renderButton(Keys.DECREASE)}
        {renderButton(Keys.RESET)}

        <div className={styles.divider} />

        {renderButton(Keys.FORGET)}
        {renderButton(Keys.BOOKMARK)}
      </section>
    </footer>
  )
}

export default Ratings
