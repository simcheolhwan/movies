import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../api/firebase"
import { useAuth } from "../api/hooks"

const SignIn = () => {
  const navigate = useNavigate()
  const [, setAuthenticated] = useAuth()
  const [values, setValues] = useState({ email: "", password: "" })
  const { email, password } = values

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget
    setValues({ ...values, [name]: value })
  }

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setAuthenticated(true)
      navigate("/", { replace: true })
    } catch (error) {
      alert((error as Error).message)
    }
  }

  return (
    <form onSubmit={submit}>
      <input type="email" name="email" value={email} onChange={handleChange} />
      <input type="password" name="password" value={password} onChange={handleChange} />
      <button type="submit" />
    </form>
  )
}

export default SignIn
