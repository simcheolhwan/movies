import { useFilter } from "../api/hooks"
import styles from "./Count.module.scss"

const Count = () => {
  const { count } = useFilter()
  const link = `검색결과 ${count}개`
  return <span className={styles.text}>{link}</span>
}

export default Count
