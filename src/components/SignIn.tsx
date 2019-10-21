import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { auth } from '../api/firebase'
import { useAuth } from '../api/hooks'

const SignIn = () => {
  const [authenticated, setAuthenticated] = useAuth()
  const [values, setValues] = useState({ email: '', password: '' })
  const { email, password } = values

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const { name, value } = e.currentTarget
    setValues({ ...values, [name]: value })
  }

  const submit: React.FormEventHandler<HTMLFormElement> = async e => {
    e.preventDefault()
    try {
      await auth.signInWithEmailAndPassword(email, password)
      setAuthenticated(true)
    } catch (error) {
      alert(error.message)
    }
  }

  return authenticated ? (
    <Redirect to="/" />
  ) : (
    <form onSubmit={submit}>
      <input type="email" name="email" value={email} onChange={handleChange} />
      <input
        type="password"
        name="password"
        value={password}
        onChange={handleChange}
      />
      <button type="submit" />
    </form>
  )
}

export default SignIn
