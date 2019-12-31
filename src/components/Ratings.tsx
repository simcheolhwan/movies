import React, { HTMLAttributes } from 'react'
import classNames from 'classnames'
import Octicon, { OcticonProps } from '@primer/octicons-react'
import { Star, Bookmark, Thumbsup, Check } from '@primer/octicons-react'
import styles from './Ratings.module.scss'

enum Keys {
  BEST = 'best',
  GOOD = 'good',
  RESET = 'reset',
  QUALITY = 'quality'
}

interface Attrs {
  active: boolean
  onClick: () => void
}

interface Props extends HTMLAttributes<HTMLElement> {
  buttons: { [K in Keys]?: Attrs }
}

const icons: { [K in Keys]: OcticonProps['icon'] } = {
  best: Star,
  good: Thumbsup,
  reset: Check,
  quality: Bookmark
}

const activeClassNames: { [K in Keys]?: string } = {
  quality: styles.yellow
}

const Ratings = ({ buttons, className }: Props) => {
  const renderButton = (key: Keys) => {
    const icon = icons[key]
    const { active, onClick } = buttons[key]!
    const activeClassName = activeClassNames[key] || styles.active
    const className = classNames(styles.button, active && activeClassName)

    return (
      <button className={className} onClick={onClick}>
        <Octicon icon={icon} />
      </button>
    )
  }

  return (
    <div className={classNames(styles.component, className)}>
      <section className={styles.grade}>
        {renderButton(Keys.BEST)}
        {renderButton(Keys.GOOD)}
        {buttons[Keys.RESET] && renderButton(Keys.RESET)}
      </section>
      {renderButton(Keys.QUALITY)}
    </div>
  )
}

export default Ratings
