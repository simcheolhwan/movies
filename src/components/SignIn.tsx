import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../api/firebase"
import { useAuth } from "../api/hooks"
import styles from "./SignIn.module.scss"

const SignIn = () => {
  const navigate = useNavigate()
  const [, setAuthenticated] = useAuth()
  const [values, setValues] = useState({ email: "", password: "" })
  const { email, password } = values

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget
    setValues({ ...values, [name]: value })
  }

  const [submitting, setSubmitting] = useState(false)
  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      setSubmitting(true)
      await signInWithEmailAndPassword(auth, email, password)
      setAuthenticated(true)
      navigate("/", { replace: true })
    } catch (error) {
      alert((error as Error).message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit}>
      <div className={styles.field}>
        <label htmlFor="email">이메일</label>
        <input type="email" id="email" name="email" value={email} onChange={handleChange} />
      </div>

      <div className={styles.field}>
        <label htmlFor="password">비밀번호</label>
        <input type="password" id="password" name="password" value={password} onChange={handleChange} />
      </div>

      <button type="submit" disabled={submitting}>
        {submitting ? "제출중..." : "제출"}
      </button>
    </form>
  )
}

export default SignIn
